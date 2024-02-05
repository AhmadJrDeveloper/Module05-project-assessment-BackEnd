import express from "express";
import UserController from "../controllers/userController.js";
const userRouter = express.Router();

userRouter.post("",UserController.createUser);
userRouter.post("/login",UserController.login);
userRouter.post("/logout",UserController.logout);
userRouter.get("/",UserController.readUser);
userRouter.get("/:id",UserController.readOneUser);
userRouter.patch("/:id",UserController.updateUser);
userRouter.delete("/:id",UserController.deleteUser);

export default userRouter;