import * as React from 'react'
import { Button, Text } from '@react-email/components'
import { EmailLayout, emailStyles } from './brand'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({ siteName, confirmationUrl }: MagicLinkEmailProps) => (
  <EmailLayout siteName={siteName} preview={`Tu enlace de acceso a ${siteName}`} title="Accede a tu cuenta">
    <Text style={emailStyles.text}>Usa este enlace seguro para iniciar sesión en {siteName}. El enlace es temporal; no lo compartas.</Text>
    <Button href={confirmationUrl} style={emailStyles.button}>Iniciar sesión</Button>
    <Text style={emailStyles.footer}>Si no solicitaste este enlace, puedes ignorar este correo.</Text>
  </EmailLayout>
)

export default MagicLinkEmail
