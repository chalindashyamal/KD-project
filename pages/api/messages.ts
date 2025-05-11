import { PrismaClient, User } from '@/generated/prisma';
import { z } from "zod"
import { withAuth } from '@/lib/auth';

const prisma = new PrismaClient();

type Message = {
    id: string
    sender: string
    senderId: string
    recipient: string
    recipientId: string
    content: string
    timestamp: Date
}

type Conversation = {
    id: string
    participant: string
    participantId: string
    role: string
    lastMessage: string
    timestamp: Date
    messages: Message[]
}

function buildConversationList(messages: Message[], currentUserId: string): Conversation[] {
    const conversationMap = new Map<string, Conversation>();

    messages.forEach((message) => {
        const otherParticipantId =
            message.senderId === currentUserId ? message.recipientId : message.senderId;

        const otherParticipantName =
            message.senderId === currentUserId ? message.recipient : message.sender;

        if (!conversationMap.has(otherParticipantId)) {
            conversationMap.set(otherParticipantId, {
                id: `${currentUserId}-${otherParticipantId}`,
                participant: otherParticipantName,
                participantId: otherParticipantId,
                role: message.senderId === currentUserId ? "recipient" : "sender",
                lastMessage: message.content,
                timestamp: message.timestamp,
                messages: [message],
            });
        } else {
            const conversation = conversationMap.get(otherParticipantId)!;
            conversation.messages.push(message);

            // Update the last message and timestamp if the current message is newer
            if (message.timestamp > conversation.timestamp) {
                conversation.lastMessage = message.content;
                conversation.timestamp = message.timestamp;
            }
        }
    });

    return Array.from(conversationMap.values());
}

export default withAuth(async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { to, content } = req.body;

            const message = await prisma.message.create({
                data: {
                    senderId: req.user.id,
                    recipientId: to,
                    content,
                    timestamp: new Date(),
                },
            });

            res.status(201).json(message);
        } catch (error) {
            console.error("Error creating prescription:", error);
            res.status(500).json({ error: "Failed to create prescription." });
        }
    } else if (req.method === "GET") {
        try {

            const msgs = await prisma.message.findMany({
                where: {
                    OR: [
                        { senderId: req.user.id },
                        { recipientId: req.user.id }
                    ]
                },
                include: {
                    sender: {
                        select: {
                            name: true
                        }
                    },
                    recipient: {
                        select: {
                            name: true
                        }
                    }
                },
            });

            const messages = msgs.map((message) => ({
                id: message.id,
                sender: message.sender.name,
                senderId: message.senderId,
                recipient: message.recipient.name,
                recipientId: message.recipientId,
                content: message.content,
                timestamp: message.timestamp
            }) as Message);

            const conversations = buildConversationList(messages, req.user.id);
            function addUser(user: User) {
                if (user.id === req.user.id) {
                    return; // Skip the current user
                }
                const existingConversation = conversations.find(
                    (conversation) => conversation.participantId === user.id
                );
                if (existingConversation) {
                    return; // Skip if the conversation already exists
                }
                conversations.push({
                    id: user.id,
                    participant: user.name || "",
                    participantId: user.id,
                    role: user.role,
                    lastMessage: "",
                    timestamp: new Date(),
                    messages: [],
                });
            }
            if (req.user.role === "patient") {
                const users = await prisma.user.findMany({
                    where: {
                        OR: [
                            { role: "doctor" },
                            { role: "staff" }
                        ]
                    }
                });
                users.forEach(addUser);
            } else {
                const users = await prisma.user.findMany();
                users.forEach(addUser);
            }

            res.status(200).json(conversations);
        } catch (error) {
            console.error("Error fetching prescriptions:", error);
            res.status(500).json({ error: "Failed to fetch prescriptions." });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
})
