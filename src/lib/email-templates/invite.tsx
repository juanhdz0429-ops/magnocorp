import * as React from 'react'
import { Button, Link, Text } from '@react-email/components'
import { EmailLayout, emailStyles } from './brand'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({ siteName, siteUrl, confirmationUrl }: InviteEmailProps) => (
  <EmailLayout siteName={siteName} preview={`Te invitaron a ${siteName}`} title="Tu invitación a MagnoCorp">
    <Text style={emailStyles.text}>Recibiste una invitación para crear una cuenta en <Link href={siteUrl} style={emailStyles.link}>{siteName}</Link>. Acepta la invitación para continuar con tu registro.</Text>
    <Button href={confirmationUrl} style={emailStyles.button}>Aceptar invitación</Button>
    <Text style={emailStyles.footer}>Si no esperabas esta invitación, puedes ignorar este correo.</Text>
  </EmailLayout>
)

export default InviteEmail
