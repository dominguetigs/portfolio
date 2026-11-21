import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { ContactFormEmail } from '@/emails/contact-email';
import { contactFormSchema } from '@/sections/contact/schemas';

export async function POST(request: Request) {
  try {
    const parsed = contactFormSchema.safeParse(
      await request.json().catch(() => null),
    );

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Name, a valid email and a message are required' },
        { status: 400 },
      );
    }

    // Created per request, so a build without RESEND_API_KEY does not fail.
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 503 },
      );
    }

    const { name, email, message } = parsed.data;
    const resend = new Resend(apiKey);

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
