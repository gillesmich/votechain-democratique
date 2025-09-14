import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { authenticator } from "https://esm.sh/otplib@12.0.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: user } = await supabaseClient.auth.getUser(token);

    if (!user.user) {
      throw new Error('User not found');
    }

    // Generate a secret for the user
    const secret = authenticator.generateSecret();
    const service = "Démocratie Directe";
    const account = user.user.email;
    
    // Create the otpauth URL for QR code
    const otpauth = authenticator.keyuri(account!, service, secret);

    // Store the secret in the user's profile
    await supabaseClient
      .from('profiles')
      .update({ two_factor_secret: secret })
      .eq('id', user.user.id);

    console.log('2FA setup initiated for user:', user.user.id);

    return new Response(
      JSON.stringify({
        qrCode: otpauth,
        secret: secret
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in setup-2fa function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});