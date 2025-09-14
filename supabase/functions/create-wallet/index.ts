import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

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

    // Generate a mock wallet address (in a real implementation, this would interact with an actual blockchain)
    const walletAddress = `0x${Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`;

    // Update user profile with wallet address
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({ wallet_address: walletAddress })
      .eq('id', user.user.id);

    if (updateError) {
      throw updateError;
    }

    // Record the wallet creation transaction
    const { error: txError } = await supabaseClient
      .from('blockchain_transactions')
      .insert({
        user_id: user.user.id,
        transaction_hash: `0x${Array.from({ length: 64 }, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('')}`,
        transaction_type: 'wallet_creation',
        status: 'confirmed',
        block_number: Math.floor(Math.random() * 1000000),
        metadata: { wallet_address: walletAddress }
      });

    if (txError) {
      console.error('Error recording transaction:', txError);
    }

    console.log('Wallet created for user:', user.user.id, 'Address:', walletAddress);

    return new Response(
      JSON.stringify({ walletAddress }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in create-wallet function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});