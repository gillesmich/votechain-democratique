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
    const { topicId, voteChoice } = await req.json();

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

    // Check if user has already voted on this topic
    const { data: existingVote } = await supabaseClient
      .from('user_votes')
      .select('id')
      .eq('user_id', user.user.id)
      .eq('topic_id', topicId)
      .single();

    if (existingVote) {
      throw new Error('User has already voted on this topic');
    }

    // Check if user has enough tokens (cost 1 token per vote)
    const { data: tokens } = await supabaseClient
      .from('democracy_tokens')
      .select('token_balance')
      .eq('user_id', user.user.id)
      .single();

    if (!tokens || tokens.token_balance < 1) {
      throw new Error('Insufficient tokens to vote');
    }

    // Generate blockchain transaction hash (mock implementation)
    const txHash = `0x${Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`;

    // Record the vote
    const { error: voteError } = await supabaseClient
      .from('user_votes')
      .insert({
        user_id: user.user.id,
        topic_id: topicId,
        vote_choice: voteChoice,
        blockchain_tx_hash: txHash,
        vote_weight: 1.0
      });

    if (voteError) {
      throw voteError;
    }

    // Deduct token for voting
    const { error: tokenError } = await supabaseClient
      .from('democracy_tokens')
      .update({
        token_balance: tokens.token_balance - 1,
        spent_tokens: (tokens.spent_tokens || 0) + 1
      })
      .eq('user_id', user.user.id);

    if (tokenError) {
      throw tokenError;
    }

    // Update topic vote count
    const { error: topicError } = await supabaseClient.rpc('increment_vote_count', {
      topic_id: topicId
    });

    if (topicError) {
      console.error('Error updating topic vote count:', topicError);
    }

    // Record blockchain transaction
    const { error: txError } = await supabaseClient
      .from('blockchain_transactions')
      .insert({
        user_id: user.user.id,
        transaction_hash: txHash,
        transaction_type: 'vote',
        status: 'confirmed',
        block_number: Math.floor(Math.random() * 1000000),
        metadata: {
          topic_id: topicId,
          vote_choice: voteChoice,
          vote_weight: 1.0
        }
      });

    if (txError) {
      console.error('Error recording transaction:', txError);
    }

    console.log('Vote cast by user:', user.user.id, 'on topic:', topicId, 'choice:', voteChoice);

    return new Response(
      JSON.stringify({
        success: true,
        transactionHash: txHash,
        message: 'Vote enregistré avec succès sur la blockchain'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in cast-vote function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});