import { PrismaClient, User } from '@/generated/prisma';
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

        const otherParticipantRole =
            message.senderId === currentUserId ? "recipient" : "sender";

        if (!conversationMap.has(otherParticipantId)) {
            conversationMap.set(otherParticipantId, {
                id: `${currentUserId}-${otherParticipantId}`,
                participant: otherParticipantName || "Unknown",
                participantId: otherParticipantId,
                role: otherParticipantRole,
                lastMessage: message.content || "",
                timestamp: message.timestamp,
                messages: [message],
            });
        } else {
            const conversation = conversationMap.get(otherParticipantId)!;
            conversation.messages.push(message);

            // Update the last message and timestamp if the current message is newer
            if (message.timestamp > conversation.timestamp) {
                conversation.lastMessage = message.content || "";
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

            const sender = await prisma.user.findUnique({
                where: { id: req.user.id },
                select: { name: true },
            });

            const recipient = await prisma.user.findUnique({
                where: { id: to },
                select: { name: true, role: true },
            });

            if (!sender || !recipient) {
                return res.status(404).json({ error: "Sender or recipient not found." });
            }

            const message = await prisma.message.create({
                data: {
                    senderId: req.user.id,
                    recipientId: to,
                    content,
                    timestamp: new Date(),
                },
            });

            res.status(201).json({
                id: message.id,
                sender: sender.name || "Unknown",
                senderId: message.senderId,
                recipient: recipient.name || "Unknown",
                recipientId: message.recipientId,
                content: message.content,
                timestamp: message.timestamp,
            });
        } catch (error) {
            console.error("Error creating message:", error);
            res.status(500).json({ error: "Failed to create message." });
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
                            id: true,
                            name: true,
                            role: true
                        }
                    },
                    recipient: {
                        select: {
                            id: true,
                            name: true,
                            role: true
                        }
                    }
                },
            });

            const messages = msgs.map((message) => ({
                id: message.id,
                sender: message.sender?.name || "Unknown",
                senderId: message.senderId,
                recipient: message.recipient?.name || "Unknown",
                recipientId: message.recipientId,
                content: message.content || "",
                timestamp: message.timestamp
            }) as Message);

            let conversations = buildConversationList(messages, req.user.id);

            // Fetch all relevant users to ensure empty conversations are included
            const users = req.user.role === "patient"
                ? await prisma.user.findMany({
                    where: {
                        OR: [
                            { role: "doctor" },
                            { role: "staff" }
                        ]
                    }
                })
                : await prisma.user.findMany();

            users.forEach((user: User) => {
                if (user.id === req.user.id) return; // Skip the current user

                const existingConversation = conversations.find(
                    (conversation) => conversation.participantId === user.id
                );
                if (existingConversation) {
                    // Update role based on actual user role
                    existingConversation.role = user.role || "unknown";
                    return;
                }

                conversations.push({
                    id: `${req.user.id}-${user.id}`,
                    participant: user.name || "Unknown",
                    participantId: user.id,
                    role: user.role || "unknown",
                    lastMessage: "",
                    timestamp: new Date(),
                    messages: [],
                });
            });

            // Sort conversations by timestamp (most recent first)
            conversations.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

            res.status(200).json(conversations);
        } catch (error) {
            console.error("Error fetching messages:", error);
            res.status(500).json({ error: "Failed to fetch messages." });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
})