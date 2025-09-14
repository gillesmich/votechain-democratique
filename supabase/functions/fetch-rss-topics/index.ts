import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sources RSS françaises principales
const rssSources = [
  {
    name: "Le Monde",
    url: "https://www.lemonde.fr/rss/une.xml",
    category: "Général"
  },
  {
    name: "Le Figaro", 
    url: "https://www.lefigaro.fr/rss/figaro_actualites.xml",
    category: "Général"
  },
  {
    name: "Libération",
    url: "https://www.liberation.fr/arc/outboundfeeds/rss/",
    category: "Général"
  },
  {
    name: "Les Échos",
    url: "https://www.lesechos.fr/rss/rss_une.xml", 
    category: "Économie"
  },
  {
    name: "Franceinfo",
    url: "https://www.francetvinfo.fr/titres.rss",
    category: "Général"
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting RSS feed processing...');
    
    const newTopics = [];

    for (const source of rssSources) {
      try {
        console.log(`Fetching RSS from ${source.name}...`);
        
        // Fetch RSS feed
        const response = await fetch(source.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        if (!response.ok) {
          console.error(`Failed to fetch ${source.name}: ${response.status}`);
          continue;
        }

        const rssText = await response.text();
        console.log(`Fetched ${rssText.length} characters from ${source.name}`);

        // Parse RSS (simple XML parsing)
        const items = parseRSSItems(rssText, source);
        
        // Process first 3 items from each source
        for (const item of items.slice(0, 3)) {
          // Check if topic already exists
          const { data: existing } = await supabaseClient
            .from('voting_topics')
            .select('id')
            .eq('title', item.title)
            .single();

          if (!existing) {
            newTopics.push(item);
          }
        }

      } catch (error) {
        console.error(`Error processing ${source.name}:`, error);
        continue;
      }
    }

    console.log(`Processed ${newTopics.length} new topics`);

    // Insert new topics into database
    if (newTopics.length > 0) {
      const { data, error } = await supabaseClient
        .from('voting_topics')
        .insert(newTopics)
        .select();

      if (error) {
        throw error;
      }

      console.log(`Inserted ${data.length} new topics into database`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: newTopics.length,
        message: `Traité ${newTopics.length} nouveaux sujets d'actualité` 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in fetch-rss-topics function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function parseRSSItems(rssText: string, source: any) {
  const items = [];
  
  // Simple regex-based XML parsing for RSS items
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  const titleRegex = /<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>|<title[^>]*>(.*?)<\/title>/i;
  const descRegex = /<description[^>]*><!\[CDATA\[(.*?)\]\]><\/description>|<description[^>]*>(.*?)<\/description>/i;
  const linkRegex = /<link[^>]*>(.*?)<\/link>/i;
  const pubDateRegex = /<pubDate[^>]*>(.*?)<\/pubDate>/i;

  let match;
  while ((match = itemRegex.exec(rssText)) !== null && items.length < 5) {
    const itemContent = match[1];
    
    const titleMatch = titleRegex.exec(itemContent);
    const descMatch = descRegex.exec(itemContent);
    const linkMatch = linkRegex.exec(itemContent);
    
    if (titleMatch) {
      const title = (titleMatch[1] || titleMatch[2] || '').trim();
      const description = (descMatch?.[1] || descMatch?.[2] || '').trim().substring(0, 500);
      const newsUrl = (linkMatch?.[1] || '').trim();
      
      // Skip if title is too short or contains unwanted content
      if (title.length > 20 && !title.toLowerCase().includes('podcast') && !title.toLowerCase().includes('direct')) {
        
        // Categorize based on keywords
        let category = source.category;
        const titleLower = title.toLowerCase();
        
        if (titleLower.includes('macron') || titleLower.includes('gouvernement') || titleLower.includes('ministre')) {
          category = 'Politique';
        } else if (titleLower.includes('économie') || titleLower.includes('emploi') || titleLower.includes('inflation')) {
          category = 'Économie';
        } else if (titleLower.includes('école') || titleLower.includes('université') || titleLower.includes('éducation')) {
          category = 'Éducation';
        } else if (titleLower.includes('immigration') || titleLower.includes('social') || titleLower.includes('retraite')) {
          category = 'Société';
        } else if (titleLower.includes('climat') || titleLower.includes('environnement') || titleLower.includes('nucléaire')) {
          category = 'Environnement';
        }

        items.push({
          title: title,
          description: description || `Article de ${source.name} sur l'actualité politique française.`,
          source: source.name,
          category: category,
          news_url: newsUrl,
          is_active: true,
          total_votes: 0
        });
      }
    }
  }
  
  return items;
}