import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://jsr.io/@supabase/supabase-js/2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fonction pour obtenir l'IP du client
function getClientIP(request: Request): string {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  // Prendre la première IP si plusieurs sont présentes
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  
  return xRealIP || cfConnectingIP || '127.0.0.1';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { email, userAgent, browserFingerprint } = await req.json();
    
    const clientIP = getClientIP(req);
    
    console.log(`Vérification inscription pour IP: ${clientIP}, Email: ${email}`);

    // Appeler la fonction de vérification
    const { data, error } = await supabase.rpc('check_registration_attempt', {
      p_ip_address: clientIP,
      p_user_agent: userAgent || '',
      p_browser_fingerprint: browserFingerprint || '',
      p_email: email
    });

    if (error) {
      console.error('Erreur lors de la vérification:', error);
      return new Response(
        JSON.stringify({ 
          allowed: false, 
          reason: 'Erreur technique, veuillez réessayer plus tard' 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Résultat vérification:', data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erreur dans check-registration:', error);
    return new Response(
      JSON.stringify({ 
        allowed: false, 
        reason: 'Erreur technique, veuillez réessayer plus tard' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});