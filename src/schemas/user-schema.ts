import { z } from 'zod'

export const updateUserSettingsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  avatar: z.any().optional(),
  theme: z.string(),
  remindEmail: z.string(),
  remindByEmailEnabled: z.boolean(),
  oldPassword: z.string(),
  password: z.string(),
  passwordConfirm: z.string()
})

export type UpdateUserSettingsFields = z.infer<typeof updateUserSettingsSchema>
