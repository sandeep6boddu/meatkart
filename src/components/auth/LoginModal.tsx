"use client"

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LoginForm } from "@/components/auth/LoginForm"
import { useState } from "react"

export function LoginModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="tw-max-w-4xl tw-p-0 tw-overflow-hidden tw-bg-transparent tw-border-none tw-shadow-none">
        <LoginForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
