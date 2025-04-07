import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ContactFormEmail } from '@/emails/contact-email';

// Inicializar o cliente Resend com a API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Validação básica dos dados
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 },
      );
    }

    // Enviar o email usando o Resend
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Contact Form <onboarding@resend.dev>',
      to:
        process.env.TO_EMAIL ||
        process.env.FROM_EMAIL ||
        'your-email@example.com',
      subject: `Contato Portfolio - ${name}`,
      replyTo: email,
      react: ContactFormEmail({ name, email, message }),
    });

    if (error) {
      console.error('Error sending email:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, message: 'Email sent successfully', id: data?.id },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
