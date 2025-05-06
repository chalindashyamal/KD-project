import { NextApiRequest, NextApiResponse } from "next";
import {serialize} from "cookie";


export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // Clear the authToken cookie
    res.setHeader(
        "Set-Cookie",
        serialize("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            expires: new Date(0), // Expire the cookie immediately
        })
    );

    res.status(200).json({ message: "Logged out successfully" });
}