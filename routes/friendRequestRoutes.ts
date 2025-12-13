import express from "express";
import { protectedRoute } from "../middleware/authMiddleware";
import {
  acceptFriendRequest,
  declineFriendRequest,
  cancelFriendRequest,
  getFriendsList,
  getIncomingRequests,
  sendFriendRequest,
} from "../controllers/friendRequestController";

const router = express.Router();

router.post("/request", protectedRoute, sendFriendRequest);
router.get("/requests", protectedRoute, getIncomingRequests);
router.patch("/accept/:id", protectedRoute, acceptFriendRequest);
router.patch("/decline/:id", protectedRoute, declineFriendRequest);
router.patch("/cancel/:id", protectedRoute, cancelFriendRequest);
router.get("/", protectedRoute, getFriendsList);

export default router;
