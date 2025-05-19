'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useState } from "react";
import request from "@/lib/request"

// Form schema for editing profile
const editFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  phone: z.string().regex(/^\(\d{3}\)\s\d{3}-\d{4}$/, { message: "Phone must be in format (123) 456-7890" }),
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
  emergencyContactName: z.string().min(1, { message: "Emergency contact name is required" }),
  emergencyContactRelation: z.string().min(1, { message: "Relationship is required" }),
  emergencyContactPhone: z.string().regex(/^\(\d{3}\)\s\d{3}-\d{4}$/, { message: "Phone must be in format (123) 456-7890" }),
});

type EditFormValues = z.input<typeof editFormSchema>;

interface Patient {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  dob: string;
  age: number;
  gender: string;
  bloodType: string;
  address: string;
  phone: string;
  email: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
    expirationDate: string;
  };
  transplantStatus: string;
  dialysisStart: string;
}

interface PatientAPI {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  address: string;
  phone: string;
  email: string | null;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  insuranceinsuranceGroupNumber: string;
  primaryDiagnosis: string;
  diagnosisDate: string;
  notes: string;
}

export default function PatientInfo() {
  const [patient, setPatient] = useState<Patient>();
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize edit form
  const form = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      phone: "",
      email: "",
      emergencyContactName: "",
      emergencyContactRelation: "",
      emergencyContactPhone: "",
    },
  });

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const fetchPatientData = async () => {
    try {
      const response = await request("/api/patient");
      if (!response.ok) {
        console.error("Failed to fetch patient data");
        return;
      }
      const data = await response.json() as PatientAPI;
      setPatient({
        id: data.id,
        name: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        dob: data.dateOfBirth,
        age: calculateAge(data.dateOfBirth),
        gender: data.gender,
        bloodType: data.bloodType,
        address: data.address,
        phone: data.phone,
        email: data.email || "N/A",
        emergencyContact: {
          name: data.emergencyContactName,
          relation: data.emergencyContactRelation,
          phone: data.emergencyContactPhone,
        },
        insurance: {
          provider: data.insuranceProvider,
          policyNumber: data.insurancePolicyNumber,
          groupNumber: data.insuranceGroupNumber,
          expirationDate: "N/A",
        },
        transplantStatus: "Unknown",
        dialysisStart: "Unknown",
      });
      // Set form default values when patient data is loaded
      form.reset({
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phone: data.phone,
        email: data.email || "",
        emergencyContactName: data.emergencyContactName,
        emergencyContactRelation: data.emergencyContactRelation,
        emergencyContactPhone: data.emergencyContactPhone,
      });
    } catch (err) {
      console.error("Error fetching patient data:", err);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  const onSubmit = async (data: EditFormValues) => {
    try {
      const response = await request("/api/patient", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: patient?.id,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phone: data.phone,
          email: data.email || null,
          emergencyContactName: data.emergencyContactName,
          emergencyContactRelation: data.emergencyContactRelation,
          emergencyContactPhone: data.emergencyContactPhone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating patient:", errorData);
        setErrorMessage("Failed to update profile. Please try again.");
        return;
      }

      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      // Refresh patient data
      await fetchPatientData();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("An error occurred:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  if (!patient) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="p-4 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2 flex flex-row justify-between items-center">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic personal details</CardDescription>
            </div>
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="john.doe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="emergencyContactName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emergency Contact Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Sarah Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="emergencyContactRelation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relationship</FormLabel>
                            <FormControl>
                              <Input placeholder="Spouse" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="emergencyContactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emergency Contact Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 789-0123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold">{patient.name}</h3>
                <p className="text-sm text-muted-foreground">Patient ID: {patient.id}</p>
                <div className="flex items-center mt-1">
                  <Badge variant="outline" className="mr-2">
                    {patient.bloodType}
                  </Badge>
                  <Badge variant="secondary">{patient.transplantStatus}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-1">
                <div className="text-sm font-medium">Date of Birth</div>
                <div className="col-span-2 text-sm">
                  {patient.dob} ({patient.age} years)
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="text-sm font-medium">Gender</div>
                <div className="col-span-2 text-sm">{patient.gender}</div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="text-sm font-medium">Address</div>
                <div className="col-span-2 text-sm">{patient.address}</div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="text-sm font-medium">Phone</div>
                <div className="col-span-2 text-sm">{patient.phone}</div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="text-sm font-medium">Email</div>
                <div className="col-span-2 text-sm">{patient.email}</div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="text-sm font-medium">Dialysis Since</div>
                <div className="col-span-2 text-sm">{patient.dialysisStart}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-sm font-medium">Name</div>
                  <div className="col-span-2 text-sm">{patient.emergencyContact.name}</div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-sm font-medium">Relationship</div>
                  <div className="col-span-2 text-sm">{patient.emergencyContact.relation}</div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-sm font-medium">Phone</div>
                  <div className="col-span-2 text-sm">{patient.emergencyContact.phone}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Insurance Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-sm font-medium">Provider</div>
                  <div className="col-span-2 text-sm">{patient.insurance.provider}</div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-sm font-medium">Policy Number</div>
                  <div className="col-span-2 text-sm">{patient.insurance.policyNumber}</div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-sm font-medium">Group Number</div>
                  <div className="col-span-2 text-sm">{patient.insurance.groupNumber}</div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-sm font-medium">Expiration</div>
                  <div className="col-span-2 text-sm">{patient.insurance.expirationDate}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}