import { z } from 'zod/v4'

export const fnoCredentialsSchema = z.object({
  client_id: z.string().min(1, 'Client ID is required'),
  tenant_id: z.string().min(1, 'Tenant ID is required'),
  client_secret: z.string().min(1, 'Client Secret is required'),
  base_url: z.url('Must be a valid URL'),
  resource: z.string()
})

export type FnoCredentials = z.infer<typeof fnoCredentialsSchema>
