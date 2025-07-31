import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async (req,res,next)=>{
    try{
        const token = req.cookies.token || req.headers?.authorization?.split(' ')[1];
        if(!token){
            return res.status(401).json({message:"No token provided,authorization denied"});
        }
        const isBlacklisted = await redisClient.get(token);
        
        if(isBlacklisted){
            res.cookie('token','')
            
            return res.status(401).json({message:"Token is blacklisted,please login again"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
        
    }catch(err){
        console.error(err);
        
        return res.status(500).json({message:"Token verification failed"});
    }
}


