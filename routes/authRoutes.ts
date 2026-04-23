import express from "express";
import { loginUser, registerUser, sendUserPasswordResetEmail, resetPassword } from "../controllers/authController";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/reset-password-link', sendUserPasswordResetEmail);
router.post('/reset-password/:id', resetPassword);

export default router;