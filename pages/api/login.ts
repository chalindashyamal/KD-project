import bcrypt from "bcrypt";
import { serialize } from "cookie"
import { PrismaClient } from '@/generated/prisma';
import { NextApiRequest, NextApiResponse } from "next";
import { sessionStore } from "@/lib/auth";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { username, password, userRole } = req.body;

    // Find user using Prisma
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Check user role
    if (user.role !== userRole) {
      return res.status(403).json({ error: "Forbidden: Incorrect role" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: "7d" } // Token valid for 7 day
    );

    // Store token in a simple in-memory store (or use a database/session store)
    sessionStore[token] = user.id;

    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict", // Prevent CSRF
        path: "/", // Cookie available across the entire site
        maxAge: 7 *60 * 60 * 24, // 1 day
      })
    );

    res.status(200).json({ message: "Login successful", role: user.role });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}