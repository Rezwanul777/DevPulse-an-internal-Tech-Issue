
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

      if (token && token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
      }

      if (!token && req.cookies?.accessToken) {
        token = req.cookies.accessToken;
      }

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized",
          errors: "Access token is missing",
        });
      }

      const decoded = jwt.verify(token, config.access_token_secret);

      req.user = decoded;

      if (requiredRoles.length > 0 && !requiredRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden access",
          errors: "You do not have permission to access this route",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
        errors: "JWT verification failed",
      });
    }
  };
};

export default auth;