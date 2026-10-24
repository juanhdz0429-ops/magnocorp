import * as React from 'react'
import { Button, Text } from '@react-email/components'
import { EmailLayout, emailStyles } from './brand'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({ siteName, confirmationUrl }: RecoveryEmailProps) => (
  <EmailLayout siteName={siteName} preview={`Restablece tu contraseña de ${siteName}`} title="Recupera tu contraseña">
    <Text style={emailStyles.text}>Recibimos una solicitud para restablecer la contraseña de tu cuenta en {siteName}. Usa el siguiente enlace para elegir una nueva contraseña.</Text>
    <Button href={confirmationUrl} style={emailStyles.button}>Restablecer contraseña</Button>
    <Text style={emailStyles.footer}>Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña no se modificará.</Text>
  </EmailLayout>
)

export default RecoveryEmail
