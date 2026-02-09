import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { name, email, message } = await req.json();

    // Validate inputs
    if (!name || typeof name !== "string" || name.trim().length === 0 || name.length > 100) {
      return new Response(JSON.stringify({ error: "Nome non valido (max 100 caratteri)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email) || email.length > 255) {
      return new Response(JSON.stringify({ error: "Email non valida" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!message || typeof message !== "string" || message.trim().length === 0 || message.length > 2000) {
      return new Response(JSON.stringify({ error: "Messaggio non valido (max 2000 caratteri)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sanitizedName = name.trim().replace(/[<>]/g, "");
    const sanitizedMessage = message.trim().replace(/[<>]/g, "");

    // Save to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert({ name: sanitizedName, email: email.trim(), message: sanitizedMessage });

    if (dbError) {
      console.error("DB error:", dbError);
    }

    // Send email via Resend
    const resend = new Resend(RESEND_API_KEY);

    const emailResponse = await resend.emails.send({
      from: "NOD Contatto <noreply@xn--ndwood-bya.com>",
      to: ["Nod.wood.art@gmail.com"],
      subject: `Nuovo messaggio da ${sanitizedName}`,
      reply_to: email.trim(),
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #faf8f5; border-radius: 8px;">
          <h1 style="font-size: 24px; color: #3d2e1f; margin-bottom: 24px; border-bottom: 2px solid #c47a2e; padding-bottom: 12px;">
            Nuovo messaggio dal sito
          </h1>
          <div style="background: white; padding: 24px; border-radius: 6px; border: 1px solid #e8e0d5;">
            <p style="margin: 0 0 12px; color: #666;"><strong style="color: #3d2e1f;">Nome:</strong> ${sanitizedName}</p>
            <p style="margin: 0 0 12px; color: #666;"><strong style="color: #3d2e1f;">Email:</strong> <a href="mailto:${email.trim()}" style="color: #c47a2e;">${email.trim()}</a></p>
            <p style="margin: 0 0 8px; color: #666;"><strong style="color: #3d2e1f;">Messaggio:</strong></p>
            <p style="margin: 0; color: #444; white-space: pre-wrap; line-height: 1.6;">${sanitizedMessage}</p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #999; text-align: center;">
            Inviato dal form di contatto di NOD Wood Art
          </p>
        </div>
      `,
    });

    console.log("Email sent:", emailResponse);

    if (emailResponse.error) {
      console.error("Resend error:", emailResponse.error);
      return new Response(JSON.stringify({ error: emailResponse.error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
