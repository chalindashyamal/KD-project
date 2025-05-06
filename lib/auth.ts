import { NextApiRequest, NextApiResponse } from "next";
import { Patient, PrismaClient, User } from '../generated/prisma';
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface NextApiRequestWithAuth extends NextApiRequest {
    user: User;
    patient?: Patient
}

type NextApiHandlerWithAuth = (req: NextApiRequestWithAuth, res: NextApiResponse) => void;

export const sessionStore: { [key: string]: string } = (globalThis as any).sessionStore = {};

export function withAuth(handler: NextApiHandlerWithAuth): NextApiHandlerWithAuth {
    return async function withAuthHandler(req: NextApiRequestWithAuth, res: NextApiResponse) {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
            });

            if (!user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            req.user = user;
            if (user.role === "patient" && user.patientId) {
                const patient = await prisma.patient.findUniqueOrThrow({
                    where: { id: user.patientId },
                });
                req.patient = patient;
            }
            return handler(req, res);
        } catch (error) {
            return res.status(401).json({ message: "Unauthorized" });
        }
    };
}