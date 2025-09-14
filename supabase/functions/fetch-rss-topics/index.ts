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
        const filteredItems = [];
        for (const item of items.slice(0, 3)) {
          // Check if topic already exists
          const { data: existing } = await supabaseClient
            .from('voting_topics')
            .select('id')
            .eq('title', item.title)
            .maybeSingle();

          if (!existing) {
            filteredItems.push(item);
          }
        }
        
        newTopics.push(...filteredItems);

      } catch (error) {
        console.error(`Error processing ${source.name}:`, error);
        continue;
      }
    }

    console.log(`Traité ${newTopics.length} nouveaux sujets avec données chiffrées`);

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
        message: `Traité ${newTopics.length} nouveaux sujets avec données chiffrées d'actualité` 
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
        
        // Vérifier si le sujet propose un choix clair ET contient des données chiffrées
        if (hasDebatableChoice(title, description) && hasNumericalData(title, description)) {
          
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

          // Reformuler le titre pour être plus clair sur le choix
          const reformulatedTitle = reformulateAsChoice(title, description);

          items.push({
            title: reformulatedTitle,
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
  }
  
  return items;
}

// Fonction pour vérifier la présence de données chiffrées
function hasNumericalData(title: string, description: string): boolean {
  const text = (title + ' ' + description).toLowerCase();
  
  // Regex pour détecter différents types de données chiffrées
  const numericalPatterns = [
    // Pourcentages
    /\d+[,.]?\d*\s*%/,
    // Montants en euros
    /\d+[,.]?\d*\s*(euros?|€|millions?|milliards?)/,
    // Années et dates
    /\d{4}|\d{1,2}\/\d{1,2}\/\d{4}/,
    // Nombres avec unités
    /\d+[,.]?\d*\s*(millions?|milliards?|milliers?|k€|m€)/,
    // Nombres suivis d'unités diverses
    /\d+[,.]?\d*\s*(heures?|jours?|ans?|années?|mois|semaines?)/,
    // Nombres purs significatifs (plus de 2 chiffres)
    /\d{3,}/,
    // Augmentation/baisse avec chiffres
    /(augmentation|baisse|hausse|diminution|croissance|recul).*?\d+/,
    // Pourcentages écrits en toutes lettres
    /(pour cent|pourcent)/,
    // Budget, coût, prix avec chiffres
    /(budget|coût|prix|dépense|investissement).*?\d+/,
    // Dates et périodes
    /(depuis|d'ici|en|pour)\s*\d{4}/
  ];
  
  return numericalPatterns.some(pattern => pattern.test(text));
}

// Fonction pour vérifier si un sujet propose un choix débattable
function hasDebatableChoice(title: string, description: string): boolean {
  const text = (title + ' ' + description).toLowerCase();
  
  // Mots-clés indiquant une proposition, une réforme, un débat
  const debatableKeywords = [
    'réforme', 'proposition', 'projet de loi', 'mesure', 'nouvelle loi',
    'débat', 'discussion', 'vote', 'adoption', 'rejet',
    'pour ou contre', 'faut-il', 'doit-on', 'devrait-on',
    'budget', 'allocation', 'augmentation', 'baisse',
    'interdiction', 'autorisation', 'légalisation',
    'création', 'suppression', 'modification',
    'investissement', 'dépense', 'économie',
    'nouvelle', 'changement', 'évolution'
  ];
  
  // Mots-clés à exclure (simples informations factuelles)
  const excludeKeywords = [
    'accident', 'décès', 'mort', 'arrestation', 'condamnation',
    'incendie', 'inondation', 'tempête', 'catastrophe',
    'résultats', 'victoire', 'défaite', 'nomination',
    'démission', 'interview', 'conférence de presse'
  ];
  
  // Vérifier s'il y a des mots-clés à exclure
  if (excludeKeywords.some(keyword => text.includes(keyword))) {
    return false;
  }
  
  // Vérifier s'il y a des mots-clés débattables
  return debatableKeywords.some(keyword => text.includes(keyword));
}

// Fonction pour reformuler le titre comme un choix clair
function reformulateAsChoice(title: string, description: string): string {
  const titleLower = title.toLowerCase();
  
  // Si le titre contient déjà une question ou un choix, le garder
  if (titleLower.includes('faut-il') || titleLower.includes('doit-on') || titleLower.includes('?')) {
    return title;
  }
  
  // Reformuler selon le type de sujet
  if (titleLower.includes('réforme')) {
    if (titleLower.includes('retraite')) {
      return title.replace(/réforme (des )?retraites?/i, 'Faut-il réformer le système de retraites ?');
    }
    if (titleLower.includes('santé')) {
      return title.replace(/réforme (de la )?santé/i, 'Faut-il réformer le système de santé ?');
    }
    return title + ' : êtes-vous favorable à cette réforme ?';
  }
  
  if (titleLower.includes('budget') || titleLower.includes('dépense') || titleLower.includes('investissement')) {
    return title + ' : soutenez-vous ces orientations budgétaires ?';
  }
  
  if (titleLower.includes('nouvelle loi') || titleLower.includes('projet de loi')) {
    return title + ' : êtes-vous favorable à cette proposition ?';
  }
  
  if (titleLower.includes('immigration')) {
    return title + ' : soutenez-vous ces mesures sur l\'immigration ?';
  }
  
  if (titleLower.includes('nucléaire') || titleLower.includes('énergie')) {
    return title + ' : quelle politique énergétique privilégier ?';
  }
  
  if (titleLower.includes('éducation') || titleLower.includes('école')) {
    return title + ' : approuvez-vous ces changements éducatifs ?';
  }
  
  // Cas général : ajouter une question de soutien
  return title + ' : êtes-vous favorable à cette mesure ?';
}