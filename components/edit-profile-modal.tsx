"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Settings, Loader2, AlertCircle } from "lucide-react"

interface EditProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userEmail: string
  onProfileUpdated: (newName: string) => void
}

const inputClass =
  "border-white/15 bg-white/5 text-white placeholder:text-white/30 focus-visible:border-[#8b5cf6] focus-visible:ring-[#8b5cf6]/30"

export function EditProfileModal({
  open,
  onOpenChange,
  userEmail,
  onProfileUpdated
}: EditProfileModalProps) {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [msg, setMsg] = useState({ type: "", text: "" })

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMsg({ type: "", text: "" })

    try {
      const token = localStorage.getItem("internleaks_token")

      const response = await axios.post("http://localhost:8080/api/v1/auth/update-profile", 
        {
          email: userEmail,
          name: name,
          password: password
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 200) {
        setMsg({ type: "success", text: "Profile updated successfully!" })
        if (name) {
            onProfileUpdated(name) 
        }
        setTimeout(() => {
            onOpenChange(false) 
            setMsg({ type: "", text: "" })
            setPassword("")
        }, 1500)
      }
    } catch (error) {
      console.error("Update Error:", error)
      setMsg({ type: "error", text: "Failed to update profile. Check backend logs." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-[#0B0F19] text-white sm:max-w-md">
        <DialogHeader>
          <span className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#8b5cf6]/15 ring-1 ring-[#8b5cf6]/40">
            <Settings className="h-6 w-6 text-[#8b5cf6]" />
          </span>
          <DialogTitle className="text-center text-xl text-white">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        {msg.text && (
          <div className={`flex items-center gap-2 rounded-lg p-3 text-sm border ${
              msg.type === "error" ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
          }`}>
            {msg.type === "error" ? <AlertCircle className="h-4 w-4 shrink-0" /> : <Settings className="h-4 w-4 shrink-0" />}
            <p>{msg.text}</p>
          </div>
        )}

        <form onSubmit={handleUpdate} className="mt-2 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-white/80">Update Full Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Leave blank to keep current"
              className={inputClass}
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-white/80">New Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              className={inputClass}
              disabled={isLoading}
            />
          </div>
          
          <Button
            type="submit"
            disabled={isLoading || (!name && !password)}
            className="h-11 w-full gap-2 rounded-xl bg-[#8b5cf6] font-semibold text-white hover:bg-[#7c3aed] disabled:opacity-50"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? "Updating..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}