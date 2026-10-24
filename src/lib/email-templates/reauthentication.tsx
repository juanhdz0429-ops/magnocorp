import * as React from 'react'
import { Text } from '@react-email/components'
import { EmailLayout, emailStyles } from './brand'

interface ReauthenticationEmailProps {
  token: string
  siteName?: string
}

export const ReauthenticationEmail = ({ token, siteName = 'MagnoCorp' }: ReauthenticationEmailProps) => (
  <EmailLayout siteName={siteName} preview={`Tu código de verificación de ${siteName}`} title="Confirma tu identidad">
    <Text style={emailStyles.text}>Usa este código para confirmar tu identidad en {siteName} y continuar con la operación solicitada.</Text>
    <Text style={emailStyles.code}>{token}</Text>
    <Text style={emailStyles.footer}>El código es temporal. No lo compartas. Si no solicitaste esta verificación, puedes ignorar este correo.</Text>
  </EmailLayout>
)

export default ReauthenticationEmail
