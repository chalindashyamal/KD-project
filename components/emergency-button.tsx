"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, Phone } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function EmergencyButton() {
  const [open, setOpen] = useState(false)

  const handleEmergencyCall = () => {
    // In a real app, this would trigger an emergency protocol
    console.log("Emergency assistance requested")
    // Could initiate a call or send an alert to emergency contacts
  }

  return (
    <>
      <Button
        variant="destructive"
        className="gap-2 shadow-lg hover:shadow-xl transition-all"
        onClick={() => setOpen(true)}
      >
        <AlertCircle className="h-5 w-5" />
        Emergency Assistance
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Emergency Assistance</DialogTitle>
            <DialogDescription className="text-center">Do you need immediate medical assistance?</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              size="lg"
              variant="destructive"
              className="w-full text-lg py-6 shadow-md"
              onClick={handleEmergencyCall}
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Emergency Services (911)
            </Button>
            <div className="text-sm text-muted-foreground mt-2">
              <p className="font-semibold">Your emergency contacts:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Dr. Smith (Nephrologist): 555-123-4567</li>
                <li>Memorial Hospital Dialysis Unit: 555-987-6543</li>
                <li>Emergency Contact (Sarah): 555-789-0123</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

