import { Response } from "express";
import User from "../models/User";
import FriendRequest from "../models/FriendRequest";

export const searchUsers = async (req: any, res: Response) => {
  try {
    const query = req.query.query?.trim();
    const loggedInUserId = req.user._id.toString();

    if (!query) {
      return res.json([]);
    }

    const users = await User.find({
      $or: [
        { name: new RegExp(query, "i") },
        { email: new RegExp(query, "i") },
        { phone: new RegExp(query, "i") },
      ],
    })
      .select("_id name email phone friends")
      .lean();

    const loggedInUser = await User.findById(loggedInUserId).select("friends");
    const friendIds = loggedInUser?.friends.map((id) => id.toString());

    const pending = await FriendRequest.find({
      $or: [{ from: loggedInUserId }, { to: loggedInUserId }],
    }).lean();

    const incomingIds: string[] = [];
    const outgoingIds: string[] = [];
    const requestIdMap = new Map<string, string>();

    pending.forEach((req) => {
      const fromId = req.from.toString();
      const toId = req.to.toString();

      if (toId === loggedInUserId) {
        incomingIds.push(fromId);
        requestIdMap.set(fromId, req._id.toString());
      }

      if (fromId === loggedInUserId) {
        outgoingIds.push(toId);
        requestIdMap.set(toId, req._id.toString());
      }
    });

    const result = users
      .filter((u) => u._id.toString() !== loggedInUserId)
      .map((u) => {
        const id = u._id.toString();

        return {
          _id: u._id,
          name: u.name,
          email: u.email,
          isFriend: friendIds?.includes(id),
          isIncomingRequest: incomingIds.includes(id),
          isOutgoingRequest: outgoingIds.includes(id),
          requestId: requestIdMap.get(id) || null,
        };
      });

    return res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserProfile = async (req: any, res: Response) => {
  try {
    const loggedInUserId = req.user._id;
    const paramId = req.params.id;

    const targetUserId = paramId === "me" ? loggedInUserId : paramId;
    const user = await User.findById(targetUserId)
      .select("_id name email phone friends")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMe = loggedInUserId.toString() === user._id.toString();
    let isFriend = false;
    let isIncomingRequest = false;
    let isOutgoingRequest = false;
    let requestId: string | null = null;

    if (!isMe) {
      isFriend = user.friends
        .map((id: any) => id.toString())
        .includes(loggedInUserId.toString());

      const request = await FriendRequest.findOne({
        $or: [
          { from: loggedInUserId, to: user._id },
          { from: user._id, to: loggedInUserId },
        ],
      }).lean();

      if (request) {
        requestId = request._id.toString();
        isIncomingRequest = request.to.toString() === loggedInUserId.toString();
        isOutgoingRequest =
          request.from.toString() === loggedInUserId.toString();
      }
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      friends: user.friends,
      isMe,
      isFriend,
      isIncomingRequest,
      isOutgoingRequest,
      requestId,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateMyProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const { name, phone } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    return res.json({
      message: "Profile updated",
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const unfriendUser = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const friendId = req.params.id;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User not found" });
    }

    user.friends = user.friends.filter((id: any) => id.toString() !== friendId);

    friend.friends = friend.friends.filter(
      (id: any) => id.toString() !== userId.toString()
    );

    await user.save();
    await friend.save();

    await FriendRequest.deleteMany({
      $or: [
        { from: userId, to: friendId },
        { from: friendId, to: userId },
      ],
    });

    return res.json({ message: "Unfriended successfully" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
