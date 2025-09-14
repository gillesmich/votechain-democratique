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
    const { token: userToken } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const jwtToken = authHeader.replace('Bearer ', '');
    const { data: user } = await supabaseClient.auth.getUser(jwtToken);

    if (!user.user) {
      throw new Error('User not found');
    }

    // Get user's 2FA secret from profile
    const { data: profile, error } = await supabaseClient
      .from('profiles')
      .select('two_factor_secret')
      .eq('id', user.user.id)
      .single();

    if (error || !profile?.two_factor_secret) {
      throw new Error('2FA not configured for this user');
    }

    // Verify the token
    const isValid = authenticator.verify({
      token: userToken,
      secret: profile.two_factor_secret
    });

    if (isValid) {
      // Enable 2FA for the user
      await supabaseClient
        .from('profiles')
        .update({ two_factor_enabled: true })
        .eq('id', user.user.id);

      console.log('2FA verified and enabled for user:', user.user.id);
    }

    return new Response(
      JSON.stringify({ verified: isValid }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in verify-2fa function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});