
import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js"; // Assuming this is your Redis client

export const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers?.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided, authorization denied" });
        }

        const isBlacklisted = await redisClient.get(token);
        
        if (isBlacklisted) {
            res.cookie('token', '', { expires: new Date(0), httpOnly: true }); 
            return res.status(401).json({ message: "Token is blacklisted, please log in again" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (err) {
        // This is the key change for better debugging
        console.error("JWT Verification Failed:", err.name, err.message);
        
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Token expired, please log in again" });
        }
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        }
        
        return res.status(500).json({ message: "Token verification failed due to a server error." });
    }
};
