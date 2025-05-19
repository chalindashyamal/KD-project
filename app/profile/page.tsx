import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Edit, FileText, User, Activity, Pill } from "lucide-react"
import PatientInfo from "@/components/patient-info"
import MedicalHistory from "@/components/medical-history"
import LabResults from "@/components/lab-results"
import Prescriptions from "@/components/prescriptions"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Patient Profile</h1>
        
      </div>

      <Tabs defaultValue="personal">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">
            <User className="mr-2 h-4 w-4" />
            Personal Info
          </TabsTrigger>
          
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <PatientInfo />
        </TabsContent>

        <TabsContent value="medical" className="mt-6">
          <MedicalHistory />
        </TabsContent>

        <TabsContent value="lab" className="mt-6">
          <LabResults />
        </TabsContent>

        <TabsContent value="prescriptions" className="mt-6">
          <Prescriptions />
        </TabsContent>
      </Tabs>
    </div>
  )
}

