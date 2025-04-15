import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function PatientInfo() {
  // In a real app, this would come from an API or database
  const patient = {
    id: "PT-12345",
    name: "John Doe",
    dob: "January 15, 1975",
    age: 50,
    gender: "Male",
    bloodType: "O+",
    address: "123 Main Street, Anytown, CA 12345",
    phone: "(555) 123-4567",
    email: "john.doe@example.com",
    emergencyContact: {
      name: "Sarah Doe",
      relation: "Spouse",
      phone: "(555) 789-0123",
    },
    insurance: {
      provider: "HealthPlus Insurance",
      policyNumber: "HP987654321",
      groupNumber: "GRP-567890",
      expirationDate: "December 31, 2025",
    },
    transplantStatus: "Waiting List",
    dialysisStart: "March 10, 2023",
  }

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

