"use client"

import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Mail, Sparkles, AlertCircle, Loader2, CheckCircle2 } from "lucide-react"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAuthenticated: (mode: "signin" | "signup", backendCredits: number) => void
}

const inputClass =
  "border-white/15 bg-white/5 text-white placeholder:text-white/30 focus-visible:border-[#8b5cf6] focus-visible:ring-[#8b5cf6]/30"

export function AuthModal({
  open,
  onOpenChange,
  onAuthenticated,
}: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  
  // Naye States User Input aur API handling ke liye
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const toggleMode = () => {
    setMode((prev) => (prev === "signin" ? "signup" : "signin"))
    setErrorMsg("") // Mode switch karne par error hata do
  }

  // Asli API Call Function
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")

    try {
      let response;
      if (mode === "signup") {
        // Register API Call
        response = await axios.post("http://localhost:8080/api/v1/auth/register", {
          name,
          email,
          password
        })
      } else {
        // Login API Call
        response = await axios.post("http://localhost:8080/api/v1/auth/authenticate", {
          email,
          password
        })
      }

      // Agar backend ne token aur credits bheja hai
      if (response.status === 200 && response.data.token) {
        localStorage.setItem("internleaks_token", response.data.token)
        localStorage.setItem("internleaks_credits", response.data.credits.toString())
        localStorage.setItem("internleaks_user_email", email) // Sync API ke liye zaroori hai
        
        setName("")
        setEmail("")
        setPassword("")
        
        // Custom updated parameters pass kar rahe hain
        onAuthenticated(mode, response.data.credits) 
      }

    } catch (error: any) {
      console.error("Auth Error:", error)
      // Agar backend se error aaye (jaise Wrong Password ya Email exists)
      setErrorMsg(
        mode === "signin" 
          ? "Invalid email or password. Please try again." 
          : "Could not create account. Email might already be in use."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* 👉 Yahan max-h-[90vh] aur overflow-y-auto add kiya hai */}
      <DialogContent className="border-white/10 bg-[#0B0F19] text-white sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          
          <span className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#8b5cf6]/15 ring-1 ring-[#8b5cf6]/40">
            <Sparkles className="h-6 w-6 text-[#8b5cf6]" />
          </span>
          <DialogTitle className="text-center text-xl text-white">
            {mode === "signin" ? "Welcome Back" : "Create an Account"}
          </DialogTitle>
          <DialogDescription className="text-center text-white/55">
            {mode === "signin"
              ? "Sign in to keep verifying offers and stay protected."
              : "Register to unlock unlimited scans and save your history."}
          </DialogDescription>
        </DialogHeader>

        {/* 👉 NAYA CODE: Benefits of Registering (Sirf Sign Up mode mein dikhega) */}
        {mode === "signup" && (
          <div className="mt-1 rounded-xl border border-[#8b5cf6]/20 bg-[#8b5cf6]/10 p-4">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#c4b5fd]">
              Why Create an Account?
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8b5cf6]" />
                <span>Get <strong>+2 Free Credits</strong> instantly upon registration.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8b5cf6]" />
                <span>Save and securely access your <strong>Past Scan History</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8b5cf6]" />
                <span>Track and manage your submitted <strong>Scam Wall Reports</strong>.</span>
              </li>
            </ul>
          </div>
        )}

        {/* Error Message Alert */}
        {errorMsg && (
          <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        <div className="mt-2 flex flex-col gap-3">
          <Button variant="outline" className="h-11 w-full justify-center gap-2 border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">
            <GoogleIcon className="h-5 w-5" /> Continue with Google
          </Button>
          <Button variant="outline" className="h-11 w-full justify-center gap-2 border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">
            <GithubIcon className="h-5 w-5" /> Continue with GitHub
          </Button>
        </div>

        <div className="my-1 flex items-center gap-3">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-white/40">or continue with email</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
          {mode === "signup" && (
            <div className="flex flex-col gap-2">
              <Label className="text-white/80">Full Name</Label>
              <Input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className={inputClass}
                disabled={isLoading}
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label className="text-white/80">Email</Label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-white/80">Password</Label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
              disabled={isLoading}
            />
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full gap-2 rounded-xl bg-[#8b5cf6] font-semibold text-white shadow-[0_0_30px_-6px_#8b5cf6] hover:bg-[#7c3aed] disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            {isLoading ? "Please wait..." : (mode === "signin" ? "Sign In" : "Register & Get Credits")}
          </Button>
        </form>

        <div className="mt-2 text-center text-sm text-white/60">
          {mode === "signin" ? (
            <>
              Don&apos;t have an account?{" "}
              <button onClick={toggleMode} type="button" className="font-medium text-[#8b5cf6] hover:underline">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={toggleMode} type="button" className="font-medium text-[#8b5cf6] hover:underline">
                Sign in
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.3 14.6 2.4 12 2.4 6.9 2.4 2.8 6.5 2.8 11.6S6.9 20.8 12 20.8c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.6H12z" />
    </svg>
  )
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.484 17.523 2 12 2z" />
    </svg>
  )
}