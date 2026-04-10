import { UserRole } from "@prisma/client";
import { Router } from "express";

import { authenticateToken, requireRole } from "../../middleware/auth.middleware.js";
import * as usersController from "./users.controller.js";

const usersRouter = Router();

usersRouter.post("/accept-invite", usersController.acceptInvite);

usersRouter.use(authenticateToken, requireRole(UserRole.ADMIN));

usersRouter.get("/", usersController.getOrgUsers);
usersRouter.post("/invite", usersController.inviteUser);
usersRouter.patch("/:userId/role", usersController.updateUserRole);
usersRouter.delete("/:userId", usersController.removeUser);

export default usersRouter;