import type { UserRole } from "@prisma/client";
import type { Logger } from "winston";

declare global {
  namespace Express {
    interface AuthenticatedUser {
      id: string;
      organizationId: string | null;
      role: UserRole;
    }

    interface Request {
      requestId: string;
      logger: Logger;
      user?: AuthenticatedUser;
    }
  }
}

export {};