import { Router } from "express";
import { UserRole } from "@prisma/client";

import { authenticateToken, requireRole } from "../../middleware/auth.middleware.js";
import * as organizationController from "./organization.controller.js";

const organizationRouter = Router();

organizationRouter.post("/", authenticateToken, organizationController.createOrganization);
organizationRouter.get("/me", authenticateToken, organizationController.getMyOrganization);
organizationRouter.patch("/me", authenticateToken, requireRole(UserRole.ADMIN), organizationController.updateMyOrganization);

export default organizationRouter;