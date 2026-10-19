import express from "express";
import { loginUser, registerUser, sendUserPasswordResetEmail, resetPassword, logoutUser } from "../controllers/authController";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/reset-password-link', sendUserPasswordResetEmail);
router.post('/reset-password/:id', resetPassword);
router.post("/logout", logoutUser);

export default router;