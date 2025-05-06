import bcrypt from "bcrypt";
import { PrismaClient } from '@/generated/prisma';
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { username, password, role } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: { username, password: hashedPassword, role },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { username: newUser.username, role: newUser.role },
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}