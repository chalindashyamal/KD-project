import { PrismaClient } from '@/generated/prisma';
import { z } from "zod"
import { withAuth } from '@/lib/auth';
import bcrypt from "bcrypt";

const prisma = new PrismaClient()

export default withAuth(async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const data = req.body

            const ids = await prisma.patient.findMany({ select: { id: true } })
            //generate a new id not in the existing ids
            const existingIds = ids.map((patient) => patient.id)
            let newId = ''
            while (1) {
                newId = 'PT-' + Math.floor(Math.random() * 1000).toString()
                if (!existingIds.includes(newId)) {
                    break
                }
            }

            const { name, username, password, role } = {
                name:data.firstName+' '+data.lastName,
                username:data.email,
                password:data.password,
                role:'patient',
            };
            delete data.password;
  
            const newPatient = await prisma.patient.create({
                data: {
                    ...data,
                    id: newId,
                    dateOfBirth: new Date(data.dateOfBirth),
                    diagnosisDate: new Date(data.diagnosisDate),
                    allergies: { create: data.allergies },
                },
            });

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
              data: { name, username, password: hashedPassword, role, patientId: newId },
            });

            res.status(201).json(newPatient)
        } catch (error: any) {
            console.log("Error saving patient:", error.message)
            res.status(500).json({ error: "Failed to save patient data." })
        }
    } else if (req.method === "GET") {
        try {
            const id = req.user.patientId
            if (!id) {
                return res.status(400).json({ error: "Patient ID is required" })
            }

            // Fetch patient data by ID
            const patient = await prisma.patient.findUnique({
                where: { id: id as string },
            })

            if (!patient) {
                return res.status(404).json({ error: "Patient not found" })
            }

            res.status(200).json(patient)
        } catch (error) {
            console.error("Error fetching patient data:", error)
            res.status(500).json({ error: "Internal Server Error" })
        }
    } else if (req.method === "PUT") {
        try {
            const data = req.body;
            const { id, firstName, lastName, address, phone, email, emergencyContactName, emergencyContactRelation, emergencyContactPhone } = data;

            if (!id) {
                return res.status(400).json({ error: "Patient ID is required" });
            }

            // Update patient data
            const updatedPatient = await prisma.patient.update({
                where: { id },
                data: {
                    firstName,
                    lastName,
                    address,
                    phone,
                    email,
                    emergencyContactName,
                    emergencyContactRelation,
                    emergencyContactPhone,
                },
            });

            // Update user data (name and username)
            await prisma.user.update({
                where: { patientId: id },
                data: {
                    name: `${firstName} ${lastName}`,
                    username: email || undefined,
                },
            });

            res.status(200).json(updatedPatient);
        } catch (error: any) {
            console.error("Error updating patient:", error.message);
            res.status(500).json({ error: "Failed to update patient data." });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" })
    }
})

