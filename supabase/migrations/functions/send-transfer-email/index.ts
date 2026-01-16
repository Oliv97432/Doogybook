// supabase/functions/send-transfer-email/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

interface EmailRequest {
  to_email: string
  dog_name: string
  dog_photo?: string
  transfer_token: string
  expires_days: number
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to_email, dog_name, dog_photo, transfer_token, expires_days }: EmailRequest = await req.json()

    // Construire l'URL de réclamation
    const claimUrl = `https://app.wooflyapp.com/claim-dog?token=${transfer_token}`

    // Template HTML de l'email
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Un chien vous attend sur Doogybook !</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <!-- Header avec logo -->
    <div style="text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); border-radius: 20px 20px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
        🐕 Doogybook
      </h1>
    </div>

    <!-- Corps de l'email -->
    <div style="background: white; padding: 40px 30px; border-radius: 0 0 20px 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      
      <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">
        🎉 ${dog_name} vous attend !
      </h2>

      ${dog_photo ? `
      <div style="text-align: center; margin: 30px 0;">
        <img src="${dog_photo}" alt="${dog_name}" style="width: 200px; height: 200px; object-fit: cover; border-radius: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
      </div>
      ` : ''}

      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 20px 0;">
        Bonjour,
      </p>

      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 20px 0;">
        Bonne nouvelle ! <strong>${dog_name}</strong> a été adopté par vous et vous attend sur Doogybook ! 🎊
      </p>

      <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
        <p style="color: #1e40af; margin: 0; font-size: 15px; line-height: 1.6;">
          <strong>📋 Ce qui vous attend :</strong><br>
          • Toutes les informations sur ${dog_name}<br>
          • Historique des vaccinations<br>
          • Dossier médical complet<br>
          • Photos et documents<br>
          • Suivi de santé personnalisé
        </p>
      </div>

      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 20px 0;">
        Pour récupérer ${dog_name} sur votre compte, cliquez sur le bouton ci-dessous :
      </p>

      <!-- Bouton CTA -->
      <div style="text-align: center; margin: 40px 0;">
        <a href="${claimUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 18px; font-weight: bold; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);">
          Récupérer ${dog_name}
        </a>
      </div>

      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0;">
        Ou copiez ce lien dans votre navigateur :<br>
        <a href="${claimUrl}" style="color: #3b82f6; word-break: break-all;">${claimUrl}</a>
      </p>

      <!-- Info expiration -->
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 30px 0;">
        <p style="color: #92400e; margin: 0; font-size: 14px;">
          ⏰ <strong>Important :</strong> Ce lien expire dans ${expires_days} jours.
        </p>
      </div>

      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
        Si vous n'avez pas encore de compte Doogybook, vous pourrez en créer un en quelques secondes !
      </p>

    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 30px 20px; color: #9ca3af; font-size: 14px;">
      <p style="margin: 0 0 10px 0;">
        Doogybook - L'app de santé pour votre chien
      </p>
      <p style="margin: 0; font-size: 12px;">
        © ${new Date().getFullYear()} Doogybook. Tous droits réservés.
      </p>
    </div>

  </div>
</body>
</html>
    `

    // Version texte simple
    const textContent = `
🎉 ${dog_name} vous attend !

Bonjour,

Bonne nouvelle ! ${dog_name} a été adopté par vous et vous attend sur Doogybook !

Ce qui vous attend :
- Toutes les informations sur ${dog_name}
- Historique des vaccinations
- Dossier médical complet
- Photos et documents
- Suivi de santé personnalisé

Pour récupérer ${dog_name} sur votre compte, cliquez sur ce lien :
${claimUrl}

⏰ Important : Ce lien expire dans ${expires_days} jours.

Si vous n'avez pas encore de compte Doogybook, vous pourrez en créer un en quelques secondes !

Doogybook - L'app de santé pour votre chien
© ${new Date().getFullYear()} Doogybook. Tous droits réservés.
    `

    // Envoyer l'email via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Doogybook <noreply@wooflyapp.com>',
        to: [to_email],
        subject: `🎉 ${dog_name} vous attend sur Doogybook !`,
        html: htmlContent,
        text: textContent,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(`Resend API error: ${error}`)
    }

    const data = await res.json()

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
