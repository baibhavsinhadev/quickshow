import { clerkClient } from "@clerk/express";
import logger from "../config/logger.js";

const protectAdmin = async (req, res, next) => {
    try {
        const { userId } = req.auth || {};
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        };

        const user = await clerkClient.users.getUser(userId);
        const role = user?.privateMetadata?.role;

        if (role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Admin access only",
            });
        };

        next();
    } catch (error) {
        logger.error({ error }, "Protect Admin Error");

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    };
};

export default protectAdmin;