import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { email, userAgent, browserFingerprint } = await req.json();
    
    // Obtenir l'IP du client
    const clientIP = req.headers.get('cf-connecting-ip') || 
                    req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown';

    console.log('Checking registration attempt:', { 
      email, 
      clientIP, 
      userAgent: userAgent?.substring(0, 100),
      browserFingerprint 
    });

    // Appeler la fonction de vérification
    const { data, error } = await supabase.rpc('check_registration_attempt', {
      p_ip_address: clientIP,
      p_user_agent: userAgent,
      p_browser_fingerprint: browserFingerprint,
      p_email: email
    });

    if (error) {
      console.error('Error checking registration:', error);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la vérification' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Registration check result:', data);

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});