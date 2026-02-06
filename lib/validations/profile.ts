import { z } from 'zod'

export const profileSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters").max(20).optional(),
  name: z.string().trim().optional(),
})

export type ProfileFormData = z.infer<typeof profileSchema>