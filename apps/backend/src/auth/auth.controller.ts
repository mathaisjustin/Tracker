import { Request, Response } from "express";
import { supabase } from "./supabase";

export async function signup(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    console.log("[AUTH] Signup request:", email);

    if (!email || !password) {
      console.log("[AUTH] Signup failed: missing email/password");
      return res.status(400).json({ error: "Email and password required" });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.log("[AUTH] Signup error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    console.log("[AUTH] Signup success:", email);

    res.json(data);
  } catch (err) {
    console.error("[AUTH] Signup crash:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    console.log("[AUTH] Login request:", email);

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("[AUTH] Login failed:", error.message);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("[AUTH] Login success:", email);

    res.json(data);
  } catch (err) {
    console.error("[AUTH] Login crash:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    console.log("[AUTH] Password reset request:", email);

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password",
    });

    if (error) {
      console.log("[AUTH] Reset error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    console.log("[AUTH] Reset email sent:", email);

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("[AUTH] Forgot password crash:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function oauthGoogle(req: Request, res: Response) {
  console.log("[AUTH] Google OAuth requested");

  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  res.json(data);
}

export async function oauthGithub(req: Request, res: Response) {
  console.log("[AUTH] Github OAuth requested");

  const { data } = await supabase.auth.signInWithOAuth({
    provider: "github",
  });

  res.json(data);
}

export async function getMe(req: Request, res: Response) {
  try {
    console.log("[AUTH] getMe called");

    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      console.log("[AUTH] getMe failed: no token");
      return res.status(401).json({ error: "No token provided" });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      console.log("[AUTH] getMe invalid token");
      return res.status(401).json({ error: "Invalid token" });
    }

    console.log("[AUTH] getMe success:", data.user.email);

    res.json(data.user);
  } catch (err) {
    console.error("[AUTH] getMe crash:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function logout(req: Request, res: Response) {
  console.log("[AUTH] Logout requested");

  res.json({ message: "Logout handled client-side" });
}
