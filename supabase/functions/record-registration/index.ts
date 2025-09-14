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

    const { email, userId } = await req.json();
    
    const clientIP = getClientIP(req);
    
    console.log(`Enregistrement inscription réussie pour IP: ${clientIP}, Email: ${email}, User ID: ${userId}`);

    // Appeler la fonction d'enregistrement
    const { error } = await supabase.rpc('record_successful_registration', {
      p_ip_address: clientIP,
      p_email: email,
      p_user_id: userId
    });

    if (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Inscription enregistrée avec succès');

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erreur dans record-registration:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});