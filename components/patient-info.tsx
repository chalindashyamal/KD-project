'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react";
import request from "@/lib/request"

interface Patient {
  id: string;
  name: string;
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
  dateOfBirth: string; // ISO date string
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
  insuranceGroupNumber: string;
  primaryDiagnosis: string;
  diagnosisDate: string; // ISO date string
  notes: string;
}

export default function PatientInfo() {
  const [patient, setPatient] = useState<Patient>();

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

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await request("/api/patient");
        if (!response.ok) {
          console.error("Failed to fetch patient data");
          return;
        }
        const data = await response.json() as PatientAPI
        setPatient({
          id: data.id,
          name: `${data.firstName} ${data.lastName}`,
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
            expirationDate: "N/A", // Placeholder, as it's not in PatientAPI
          },
          transplantStatus: "Unknown", // Placeholder, as it's not in PatientAPI
          dialysisStart: "Unknown", // Placeholder, as it's not in PatientAPI
        });
      } catch (err) {
        console.error("Error fetching patient data:", err);
      }
    };

    fetchPatientData();
  }, []);


  if (!patient) return <p>Loading...</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your basic personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg?height=80&width=80" alt={patient.name} />
              <AvatarFallback>
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
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
  )
}

