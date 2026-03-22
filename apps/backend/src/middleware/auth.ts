import { Request, Response, NextFunction } from "express";
import { supabase } from "../db/supabase";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid authorization header" });
  }

  const token = authHeader.split(" ")[1];

  // Verify the JWT with Supabase — this checks signature + expiry
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // Attach user to request for downstream use
  req.user = {
    id: data.user.id,
    email: data.user.email ?? "",
  };

  next();
};