import * as React from 'react'
import { Button, Link, Text } from '@react-email/components'
import { EmailLayout, emailStyles } from './brand'

interface EmailChangeEmailProps {
  siteName: string
  // Keep the previous address separate from the recipient in secure email-change fanout.
  oldEmail: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({ siteName, oldEmail, newEmail, confirmationUrl }: EmailChangeEmailProps) => (
  <EmailLayout siteName={siteName} preview={`Confirma el cambio de correo en ${siteName}`} title="Confirma tu nuevo correo">
    <Text style={emailStyles.text}>Solicitaste cambiar el correo de tu cuenta en {siteName} de <Link href={`mailto:${oldEmail}`} style={emailStyles.link}>{oldEmail}</Link> a <Link href={`mailto:${newEmail}`} style={emailStyles.link}>{newEmail}</Link>.</Text>
    <Text style={emailStyles.text}>Confirma el cambio con el siguiente enlace.</Text>
    <Button href={confirmationUrl} style={emailStyles.button}>Confirmar cambio de correo</Button>
    <Text style={emailStyles.footer}>Si no solicitaste este cambio, no lo confirmes y protege tu cuenta de inmediato.</Text>
  </EmailLayout>
)

export default EmailChangeEmail
