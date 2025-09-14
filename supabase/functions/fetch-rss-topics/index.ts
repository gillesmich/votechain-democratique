import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sources RSS françaises actualisées pour septembre 2025
const rssSources = [
  {
    name: "Le Monde",
    url: "https://www.lemonde.fr/politique/rss_full.xml",
    category: "Politique"
  },
  {
    name: "Le Figaro", 
    url: "https://www.lefigaro.fr/politique/rss",
    category: "Politique"
  },
  {
    name: "Libération",
    url: "https://www.liberation.fr/politique/rss/",
    category: "Politique"
  },
  {
    name: "Les Échos",
    url: "https://www.lesechos.fr/politique-societe/rss", 
    category: "Économie"
  },
  {
    name: "Franceinfo",
    url: "https://www.francetvinfo.fr/politique.rss",
    category: "Politique"
  },
  {
    name: "Le Parisien",
    url: "https://www.leparisien.fr/politique/rss.xml",
    category: "Politique"
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

    // Nettoyer d'abord les anciens sujets périmés
    const { error: deleteError } = await supabaseClient
      .from('voting_topics')
      .delete()
      .or('title.ilike.%budget 2024%,title.ilike.%budget 24%,title.ilike.%plf 2024%,description.ilike.%budget 2024%');

    if (deleteError) {
      console.error('Erreur lors de la suppression des anciens sujets:', deleteError);
    } else {
      console.log('Anciens sujets périmés supprimés');
    }

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
      
      // Skip if title is too short or contains unwanted content or outdated topics
      if (title.length > 20 && 
          !title.toLowerCase().includes('podcast') && 
          !title.toLowerCase().includes('direct') &&
          !isOutdatedTopic(title, description)) {
        
        // Récupérer le contenu complet de l'article
        const fullContent = await fetchArticleContent(newsUrl);
        const enrichedDescription = fullContent || description;
        
        // Extraire les données objectives du sujet
        const objectiveData = extractObjectiveData(title, enrichedDescription);
        
        // Vérifier si le sujet propose un choix clair ET contient des données chiffrées STRICTES
        if (hasDebatableChoice(title, enrichedDescription) && hasStrictNumericalData(title, enrichedDescription) && objectiveData.length >= 2) {
          
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
          const reformulatedTitle = reformulateAsChoice(title, enrichedDescription);

          // Créer un résumé structuré avec les données objectives
          const structuredSummary = createStructuredSummary(enrichedDescription, objectiveData);

          items.push({
            title: reformulatedTitle,
            description: structuredSummary,
            source: source.name,
            category: category,
            news_url: newsUrl,
            is_active: true,
            total_votes: 0
          });
        } else {
          console.log(`Sujet rejeté - Titre: ${title} - Données trouvées: ${objectiveData.length} - Données strictes: ${hasStrictNumericalData(title, enrichedDescription)}`);
        }
      }
    }
  }
  
  return items;
}

// Fonction pour récupérer le contenu complet d'un article
async function fetchArticleContent(url: string): Promise<string | null> {
  if (!url) return null;
  
  try {
    console.log(`Fetching full content from: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch article content: ${response.status}`);
      return null;
    }

    const html = await response.text();
    
    // Extraire le contenu principal de l'article (simplified)
    const contentMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
                        html.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                        html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    
    if (contentMatch) {
      // Nettoyer le HTML et extraire le texte
      let content = contentMatch[1]
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Limiter à 1500 caractères pour éviter des descriptions trop longues
      return content.substring(0, 1500) + (content.length > 1500 ? '...' : '');
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching article content from ${url}:`, error);
    return null;
  }
}

// Fonction pour créer un résumé structuré avec focus sur les données
function createStructuredSummary(content: string, objectiveData: string[]): string {
  // Extraire uniquement les phrases contenant des données chiffrées
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const dataSentences = sentences.filter(sentence => {
    const lowerSentence = sentence.toLowerCase();
    return /\d+[,.]?\d*\s*(%|euros?|€|millions?|milliards?|emplois?|ans?)/.test(lowerSentence) ||
           /(budget|coût|prix|dépense|investissement|augmentation|baisse|hausse|diminution).*?\d+/.test(lowerSentence);
  });
  
  // Prendre les 2 meilleures phrases avec données + première phrase générale
  const factualSummary = dataSentences.slice(0, 2).join('. ').trim();
  const generalContext = sentences[0] || '';
  
  // Construire le résumé factuel
  let structuredSummary = `CONTEXTE: ${generalContext}`;
  
  if (factualSummary) {
    structuredSummary += `\n\nFAITS CHIFFRÉS: ${factualSummary}`;
  }
  
  if (objectiveData.length > 0) {
    structuredSummary += `\n\nDONNÉES PRÉCISES: ${objectiveData.slice(0, 3).join(' • ')}`;
  }
  
  return structuredSummary;
}

// Fonction pour vérifier la présence de données chiffrées STRICTES
function hasStrictNumericalData(title: string, description: string): boolean {
  const text = (title + ' ' + description).toLowerCase();
  
  // Compteur de données chiffrées trouvées
  let dataCount = 0;
  
  // Regex pour détecter différents types de données chiffrées PRÉCISES
  const strictPatterns = [
    // Pourcentages précis
    /\d+[,.]?\d*\s*%/g,
    // Montants en euros précis
    /\d+[,.]?\d*\s*(millions?|milliards?)\s*(d'euros?|€|euros?)/gi,
    // Nombres avec unités économiques
    /\d+[,.]?\d*\s*(k€|m€|milliards?|millions?)\s*(d'euros?|€)?/gi,
    // Augmentation/baisse avec pourcentages
    /(augmentation|baisse|hausse|diminution|croissance|recul)\s*(de\s*)?\d+[,.]?\d*\s*%/gi,
    // Budget, coût, prix avec montants précis
    /(budget|coût|prix|dépense|investissement|aide)\s*(de\s*)?\d+[,.]?\d*\s*(millions?|milliards?|€|euros?)/gi,
    // Emplois, postes avec nombres
    /\d+[,.]?\d*\s*(emplois?|postes?|suppressions?|créations?)/gi,
    // Durées précises (âge, années de service)
    /\d+\s*ans?\s*(de\s*)?(cotisation|retraite|service|travail)/gi
  ];
  
  // Compter le nombre de données objectives trouvées
  strictPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      dataCount += matches.length;
    }
  });
  
  // Exiger au moins 2 données chiffrées différentes pour être considéré comme valide
  return dataCount >= 2;
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

// Fonction pour extraire les données objectives et chiffrées précises
function extractObjectiveData(title: string, description: string): string[] {
  const text = title + ' ' + description;
  const objectiveData: string[] = [];
  
  // Extraire les pourcentages
  const percentageMatches = text.match(/\d+[,.]?\d*\s*%/g);
  if (percentageMatches) {
    percentageMatches.forEach(match => {
      objectiveData.push(`Pourcentage : ${match.trim()}`);
    });
  }
  
  // Extraire les montants en euros
  const euroMatches = text.match(/\d+[,.]?\d*\s*(millions?|milliards?)\s*(d'euros?|€|euros?)/gi);
  if (euroMatches) {
    euroMatches.forEach(match => {
      objectiveData.push(`Montant : ${match.trim()}`);
    });
  }
  
  // Extraire les dates et années
  const yearMatches = text.match(/\d{4}|\d{1,2}\/\d{1,2}\/\d{4}/g);
  if (yearMatches) {
    const uniqueYears = [...new Set(yearMatches)];
    uniqueYears.forEach(year => {
      objectiveData.push(`Date/Année : ${year}`);
    });
  }
  
  // Extraire les durées (années, mois, etc.)
  const durationMatches = text.match(/\d+[,.]?\d*\s*(ans?|années?|mois|semaines?|jours?)/gi);
  if (durationMatches) {
    durationMatches.forEach(match => {
      objectiveData.push(`Durée : ${match.trim()}`);
    });
  }
  
  // Extraire les nombres avec unités spécifiques
  const specificNumbers = text.match(/\d+[,.]?\d*\s*(emplois?|postes?|personnes?|habitants?|élèves?|étudiants?|retraités?)/gi);
  if (specificNumbers) {
    specificNumbers.forEach(match => {
      objectiveData.push(`Nombre : ${match.trim()}`);
    });
  }
  
  // Extraire les augmentations/baisses chiffrées
  const changeMatches = text.match(/(augmentation|baisse|hausse|diminution|croissance|recul)\s*(de\s*)?\d+[,.]?\d*\s*%?/gi);
  if (changeMatches) {
    changeMatches.forEach(match => {
      objectiveData.push(`Évolution : ${match.trim()}`);
    });
  }
  
  // Extraire les âges (pour retraites, etc.)
  const ageMatches = text.match(/\d+\s*ans?\s*(de\s*)?(cotisation|retraite|service)/gi);
  if (ageMatches) {
    ageMatches.forEach(match => {
      objectiveData.push(`Âge/Durée : ${match.trim()}`);
    });
  }
  
  // Nettoyer et dédupliquer
  const cleanedData = [...new Set(objectiveData)].slice(0, 4); // Max 4 données
  
  return cleanedData;
}
  
  if (titleLower.includes('éducation') || titleLower.includes('école')) {
    return title + ' : approuvez-vous ces changements éducatifs ?';
  }
  
  // Cas général : ajouter une question de soutien
  return title + ' : êtes-vous favorable à cette mesure ?';
}

// Fonction pour détecter les sujets périmés
function isOutdatedTopic(title: string, description: string): boolean {
  const text = (title + ' ' + description).toLowerCase();
  const currentYear = new Date().getFullYear(); // 2025
  
  // Mots-clés et années périmées à éviter
  const outdatedKeywords = [
    'budget 2024', 'plf 2024', 'loi de finances 2024',
    'budget 2023', 'budget 2022', 'budget 2021',
    'élections 2022', 'présidentielle 2022',
    'covid-19', 'confinement', 'pass sanitaire',
    'gilets jaunes', 'retraites 2020'
  ];
  
  // Années explicitement mentionnées qui sont passées
  const pastYearPatterns = [
    /202[0-4]/g  // Années 2020-2024
  ];
  
  // Vérifier les mots-clés périmés
  if (outdatedKeywords.some(keyword => text.includes(keyword))) {
    console.log(`Sujet périmé détecté (mot-clé): ${title}`);
    return true;
  }
  
  // Vérifier les années passées dans le contexte de projets/budgets
  for (const pattern of pastYearPatterns) {
    const matches = text.match(pattern);
    if (matches && (text.includes('budget') || text.includes('projet') || text.includes('loi de finances'))) {
      console.log(`Sujet périmé détecté (année): ${title}`);
      return true;
    }
  }
  
  // Exclure les sujets qui ne concernent que le passé récent sans impact actuel
  const pastOnlyKeywords = [
    'bilan 2024', 'résultats 2024', 'année écoulée',
    'premier trimestre', 'deuxième trimestre', 'troisième trimestre'
  ];
  
  if (pastOnlyKeywords.some(keyword => text.includes(keyword))) {
    console.log(`Sujet historique détecté: ${title}`);
    return true;
  }
  
  return false;
}