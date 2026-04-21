import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAdminNotification(data: {
  clientName: string;
  year: number;
  type: string;
}) {
  try {
    await resend.emails.send({
      from: 'TaxManager <taxmanger.ca>', 
      to: process.env.ADMIN_EMAIL as string,
      subject: `🔔 Nouvelle demande fiscale : ${data.clientName} (${data.year})`,
      html: `
        <h1>Nouvelle soumission reçue</h1>
        <p><strong>Client :</strong> ${data.clientName}</p>
        <p><strong>Année fiscale :</strong> ${data.year}</p>
        <p><strong>Type de service :</strong> ${data.type}</p>
        <hr />
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/tableau-de-bord">Accéder au tableau de bord admin</a></p>
      `,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
  }
}