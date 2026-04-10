import { LocationType, UserRole, type Prisma } from "@prisma/client";

import { createModuleLogger } from "../../config/logger.js";
import prisma from "../../lib/prisma.js";
import { HttpError } from "../../utils/http-error.js";
import type { CreateOrganizationInput, UpdateOrganizationInput } from "./organization.schema.js";

const organizationLogger = createModuleLogger("organization.service");

const organizationSummarySelect = {
  id: true,
  name: true,
  industry: true,
  logoUrl: true,
  address: true,
  currency: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      users: true,
      locations: true,
    },
  },
} satisfies Prisma.OrganizationSelect;

export const createOrganization = async (userId: string, data: CreateOrganizationInput) => {
  const organizationAddress = data.address ?? "";

  const result = await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: {
        name: data.name,
        industry: data.industry,
        address: organizationAddress,
        currency: data.currency,
        logoUrl: "",
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: {
        organizationId: organization.id,
        role: UserRole.ADMIN,
      },
    });

    const location = await tx.location.create({
      data: {
        organizationId: organization.id,
        name: "Main Location",
        type: LocationType.STORE,
        address: organizationAddress,
      },
    });

    return { organization, location };
  });

  organizationLogger.info("Created organization", {
    userId,
    organizationId: result.organization.id,
    locationId: result.location.id,
  });

  return result;
};

export const getOrganization = async (organizationId: string) => {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: organizationSummarySelect,
  });

  if (!organization) {
    throw new HttpError(404, "Organization not found");
  }

  return {
    ...organization,
    userCount: organization._count.users,
    locationCount: organization._count.locations,
  };
};

export const updateOrganization = async (organizationId: string, data: UpdateOrganizationInput) => {
  const updateData: Prisma.OrganizationUpdateInput = {
    ...(data.name !== undefined ? { name: data.name } : {}),
    ...(data.industry !== undefined ? { industry: data.industry } : {}),
    ...(data.address !== undefined ? { address: data.address } : {}),
    ...(data.currency !== undefined ? { currency: data.currency } : {}),
    ...(data.logoUrl !== undefined ? { logoUrl: data.logoUrl } : {}),
  };

  try {
    return await prisma.organization.update({
      where: { id: organizationId },
      data: updateData,
    });
  } catch (error) {
    if (
      typeof error === "object"
      && error !== null
      && "code" in error
      && error.code === "P2025"
    ) {
      throw new HttpError(404, "Organization not found");
    }

    throw error;
  }
};