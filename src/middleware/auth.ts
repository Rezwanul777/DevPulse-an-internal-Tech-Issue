
import jwt from "jsonwebtoken";
import config from "../config";
import type { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const auth = (...requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      let token = req.headers.authorization;

      // If token is in header, extract it
      if (token && token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
      }

      // If token is not in header, check cookies
      if (!token && req.cookies?.accessToken) {
        token = req.cookies.accessToken;
      }

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized",
        });
      }

      const decoded = jwt.verify(token, config.access_token_secret);

      req.user = decoded;

      // Role check
      if (requiredRoles.length > 0 && !requiredRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden access",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  };
};

export default auth;