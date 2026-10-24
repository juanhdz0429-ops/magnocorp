import * as React from 'react'
import { Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from '@react-email/components'

// Email-safe equivalents of the site's semantic navy/electric palette.
// Inline styles are required because mail clients do not load the site's CSS.
const palette = {
  background: '#ffffff',
  foreground: '#253044',
  primary: '#123e73',
  accent: '#337be4',
  muted: '#586575',
  border: '#dfe6ed',
  secondary: '#f4f7fb',
}

export const emailStyles = {
  text: { color: palette.foreground, fontSize: '15px', lineHeight: '1.7', margin: '0 0 20px' },
  link: { color: palette.primary, textDecoration: 'underline' },
  button: {
    backgroundColor: palette.primary, color: palette.background, fontSize: '15px',
    fontWeight: 'bold' as const, borderRadius: '6px', padding: '14px 24px', textDecoration: 'none',
  },
  footer: { color: palette.muted, fontSize: '12px', lineHeight: '1.7', margin: '26px 0 0' },
  code: {
    backgroundColor: palette.secondary, color: palette.primary, border: `1px solid ${palette.border}`,
    borderRadius: '6px', fontFamily: 'Courier, monospace', fontSize: '30px', fontWeight: 'bold' as const,
    textAlign: 'center' as const, padding: '18px', margin: '0 0 20px',
  },
}

export function EmailLayout({ preview, title, siteName = 'MagnoCorp', children }: {
  preview: string
  title: string
  siteName?: string
  children: React.ReactNode
}) {
  return (
    <Html lang="es" dir="ltr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: palette.background, fontFamily: 'Arial, Helvetica, sans-serif', margin: '0' }}>
        <Container style={{ maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }}>
          <Section style={{ borderTop: `4px solid ${palette.accent}`, paddingTop: '24px', marginBottom: '30px' }}>
            <Text style={{ color: palette.primary, fontSize: '26px', fontWeight: 'bold', margin: '0' }}>{siteName}</Text>
            <Text style={{ color: palette.muted, fontSize: '11px', margin: '6px 0 0' }}>IMPULSÁNDOTE A SER GRANDE</Text>
          </Section>
          <Heading style={{ color: palette.primary, fontSize: '24px', lineHeight: '1.3', margin: '0 0 22px' }}>{title}</Heading>
          {children}
          <Hr style={{ borderColor: palette.border, margin: '30px 0 20px' }} />
          <Text style={emailStyles.footer}>
            <Link href="https://magnocorp.online" style={emailStyles.link}>{siteName}</Link>
            {' · '}
            <Link href="https://magnocorp.online/conocimiento/aviso-de-privacidad" style={emailStyles.link}>Aviso de privacidad</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}