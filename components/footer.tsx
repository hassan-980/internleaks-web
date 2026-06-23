"use client"

import { toast } from "sonner"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ShieldAlert } from "lucide-react"

type LegalKey = "privacy" | "disclaimer" | "contact" | null

const inputClass =
  "border-white/15 bg-white/5 text-white placeholder:text-white/30 focus-visible:border-[#8b5cf6] focus-visible:ring-[#8b5cf6]/30"

export function Footer() {
  const [open, setOpen] = useState<LegalKey>(null)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY as string);
    formData.append("subject", "New Contact/Appeal Submission from Internleaks");
    
    try {
      const res = await fetch("https://api.web3forms.com/submit", { 
        method: "POST", 
        body: formData 
      });
      if (res.ok) {
        toast.success("Message Sent Successfully! We will review it.");
        setOpen(null);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
    }
    setIsSubmitting(false);
  };

  return (
    <footer className="mt-16 border-t border-white/10 bg-[#0B0F19]">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-8 sm:flex-row sm:items-start sm:justify-between sm:px-8">
        
        {/* Left Side: Logo & Tagline */}
        <div className="flex flex-col items-center sm:items-start gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-[#8b5cf6]" />
            <span className="text-base font-bold text-white tracking-wide">
              INTERN<span className="text-[#8b5cf6]">LEAKS</span>
            </span>
          </div>
          <p className="text-xs text-white/50 max-w-[260px] text-center sm:text-left leading-relaxed">
            Empowering students to expose fake internships. 100% free, open-source, and community-driven.
          </p>
        </div>

        {/* Center: Navigation Links */}
        <nav className="flex flex-col items-center sm:items-start gap-2.5 text-sm text-white/50 sm:pt-1">
          <button
            onClick={() => setOpen("privacy")}
            className="transition-colors hover:text-white"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setOpen("disclaimer")}
            className="transition-colors hover:text-white"
          >
            Disclaimer
          </button>
          <button
            onClick={() => setOpen("contact")}
            className="transition-colors hover:text-white"
          >
            Contact / Appeal
          </button>
        </nav>

        {/* Right Side: Exact Same Width Container dono buttons ke liye (240px) */}
        <div className="flex w-full sm:w-[240px] flex-col items-center gap-3 sm:pt-1">
          
          {/* LinkedIn Button (font-medium) */}
          <a
            href="https://www.linkedin.com/in/abhishekktech/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/5 bg-white/5 px-4 py-2 text-xs font-medium text-white/50 transition-colors hover:border-white/10 hover:text-[#8b5cf6]"
          >
            <LinkedinIcon className="h-3.5 w-3.5 shrink-0" />
            Built by Abhishek Sharma
          </a>

          {/* 👉 FIX: GitHub Button ka font-semibold hata kar font-medium kar diya */}
          <a
            href="https://github.com/AbhishekKTech/internleaks-web" 
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-400 transition-all hover:-translate-y-0.5 hover:border-emerald-500/50 hover:bg-emerald-500/20"
          >
            <GithubIcon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
            Star on GitHub ⭐
          </a>
          
        </div>

      </div>

      {/* Privacy Policy Modal */}
      <Dialog open={open === "privacy"} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="border-white/10 bg-[#0B0F19] text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Privacy Policy</DialogTitle>
            <DialogDescription className="text-white/55">How we handle your data.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm leading-relaxed text-white/70">
            <p>
              INTERNLEAKS is built privacy-first. Every uploaded offer letter is
              processed in-memory and all Personally Identifiable Information
              (PII) — names, phone numbers, emails and addresses — is
              automatically redacted before any analysis is stored.
            </p>
            <p>
              Public Scam Wall entries never expose your identity. We only
              publish the fraudulent company details, the AI risk score and the
              detected red flags.
            </p>
            <p>
              Encrypted document data is retained only as long as needed to
              generate your report and is never sold or shared with third parties.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Disclaimer Modal */}
      <Dialog open={open === "disclaimer"} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="border-white/10 bg-[#0B0F19] text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Disclaimer</DialogTitle>
            <DialogDescription className="text-white/55">Please read carefully.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm leading-relaxed text-white/70">
            <p>
              INTERNLEAKS provides AI-generated risk assessments for
              informational purposes only. A risk score is a probabilistic
              signal, not a legal determination of fraud.
            </p>
            <p>
              Always perform your own due diligence before making decisions.
              INTERNLEAKS is not liable for any actions taken based on the
              results presented.
            </p>
            <p>
              Companies listed on the Scam Wall may appeal via our Contact /
              Appeal form if they believe a report is inaccurate.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact / Appeal Modal */}
      <Dialog open={open === "contact"} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="border-white/10 bg-[#0B0F19] text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Contact / Appeal Form</DialogTitle>
            <DialogDescription className="text-white/55">Report an issue or appeal a Scam Wall listing.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-white/80">Your Name</Label>
              <Input type="text" name="name" required placeholder="e.g. Abhishek Sharma" className={inputClass} />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-white/80">Your Email</Label>
              <Input type="email" name="email" required placeholder="you@example.com" className={inputClass} />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-white/80">Company Name (If applicable)</Label>
              <Input type="text" name="company" placeholder="e.g. Stellar Tech Solutions Pvt Ltd" className={inputClass} />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-white/80">Message / Appeal Details</Label>
              <Textarea name="message" required rows={4} placeholder="Describe your concern or appeal…" className={inputClass} />
            </div>
            <Button type="submit" disabled={isSubmitting} className="h-11 w-full rounded-xl bg-[#8b5cf6] font-semibold text-white hover:bg-[#7c3aed] disabled:opacity-50">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </footer>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 110-4.14 2.07 2.07 0 010 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
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