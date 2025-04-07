import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ContactFormEmailProps {
  name: string;
  email: string;
  message: string;
}

export const ContactFormEmail = ({
  name,
  email,
  message,
}: ContactFormEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Nova mensagem de contato do seu portfolio</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Mensagem de Contato do Portfolio</Heading>

          <Section style={section}>
            <Heading as="h2" style={h2}>
              Detalhes do Contato
            </Heading>
            <Text style={infoText}>
              <strong>Nome:</strong> {name}
            </Text>
            <Text style={infoText}>
              <strong>Email:</strong> {email}
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Heading as="h2" style={h2}>
              Mensagem
            </Heading>
            <Text style={messageBox}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Esta mensagem foi enviada pelo formulário de contato do seu
            portfolio.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Estilos
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  padding: '20px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #eaeaea',
  borderRadius: '5px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
  margin: '0 auto',
  maxWidth: '600px',
  padding: '30px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '24px',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#2563eb',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '20px 0 10px',
};

const section = {
  marginBottom: '20px',
};

const infoText = {
  color: '#333',
  fontSize: '16px',
  marginBottom: '10px',
  lineHeight: '1.5',
};

const messageBox = {
  backgroundColor: '#f9fafb',
  padding: '15px',
  borderRadius: '4px',
  borderLeft: '4px solid #2563eb',
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#333',
  whiteSpace: 'pre-line' as const,
};

const hr = {
  borderColor: '#eaeaea',
  marginVertical: '20px',
};

const footer = {
  color: '#666',
  fontSize: '14px',
  textAlign: 'center' as const,
  marginTop: '20px',
};

export default ContactFormEmail;
