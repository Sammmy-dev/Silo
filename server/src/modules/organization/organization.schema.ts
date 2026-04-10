import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(2),
  industry: z.string().min(1),
  address: z.string().optional(),
  currency: z.string().min(1).default("USD"),
});

export const updateOrganizationSchema = createOrganizationSchema
  .extend({
    logoUrl: z.string().optional(),
  })
  .partial();

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;