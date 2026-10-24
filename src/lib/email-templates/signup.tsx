import * as React from 'react'
import { Button, Link, Text } from '@react-email/components'
import { EmailLayout, emailStyles } from './brand'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({ siteName, siteUrl, recipient, confirmationUrl }: SignupEmailProps) => (
  <EmailLayout siteName={siteName} preview={`Confirma tu correo en ${siteName}`} title="Confirma tu correo">
    <Text style={emailStyles.text}>Gracias por crear tu cuenta en <Link href={siteUrl} style={emailStyles.link}>{siteName}</Link>.</Text>
    <Text style={emailStyles.text}>Confirma que <Link href={`mailto:${recipient}`} style={emailStyles.link}>{recipient}</Link> es tu correo para completar el registro.</Text>
    <Button href={confirmationUrl} style={emailStyles.button}>Confirmar mi correo</Button>
    <Text style={emailStyles.footer}>Si no creaste esta cuenta, puedes ignorar este correo.</Text>
  </EmailLayout>
)

export default SignupEmail
