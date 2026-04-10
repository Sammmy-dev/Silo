import { UserRole } from "@prisma/client";
import { z } from "zod";

export const inviteUserSchema = z.object({
  email: z.email(),
  role: z.enum(UserRole),
});

export const acceptInviteSchema = z.object({
  token: z.uuid(),
  password: z.string().min(8).max(72),
});

export const updateRoleSchema = z.object({
  role: z.enum(UserRole),
});

export type InviteUserInput = z.infer<typeof inviteUserSchema>;
export type AcceptInviteInput = z.infer<typeof acceptInviteSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;