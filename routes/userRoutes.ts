import express from "express";
import { protectedRoute } from "../middleware/authMiddleware";
import {
  getUserProfile,
  searchUsers,
  updateMyProfile,
  unfriendUser,
  updateProfilePicture,
  deleteProfilePicture,
  setActiveProfilePicture
} from "../controllers/userController";

const router = express.Router();

router.get("/search", protectedRoute, searchUsers);
router.patch("/me", protectedRoute, updateMyProfile);
router.delete("/friends/:id", protectedRoute, unfriendUser);
router.patch(
  "/profile-picture",
  protectedRoute,
  updateProfilePicture,
);
router.get("/:id", protectedRoute, getUserProfile);
router.delete('/profile-picture/:public_id', protectedRoute, deleteProfilePicture);
router.patch('/set-active-profile-picture', protectedRoute, setActiveProfilePicture)

export default router;