
"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import type { Booking } from "@/lib/bookings"

interface DeleteDialogProps {
  booking: Booking
  onDelete: () => Promise<void>
}

const DeleteDialog = ({ booking, onDelete }: DeleteDialogProps) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    try {
      setLoading(true)

      await onDelete()

      // Close dialog after successful deletion
      setOpen(false)

    } catch (error) {
      console.error("Error deleting booking:", error)

    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="destructive"
        onClick={() => setOpen(true)}
      >
        Cancel Booking
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Cancel this booking?
          </DialogTitle>

          <DialogDescription>
            Are you sure you want to cancel your booking for{" "}
            <strong>{booking.title}</strong>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteDialog
