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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ShieldAlert } from "lucide-react"

type LegalKey = "privacy" | "disclaimer" | "contact" | null

const inputClass =
  "border-white/15 bg-white/5 text-white placeholder:text-white/30 focus-visible:border-[#8b5cf6] focus-visible:ring-[#8b5cf6]/30"

export function Footer() {
  const [open, setOpen] = useState<LegalKey>(null)

  return (
    <footer className="mt-16 border-t border-white/10 bg-[#0B0F19]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-[#8b5cf6]" />
          <span className="text-sm font-semibold text-white">
            INTERN<span className="text-[#8b5cf6]">LEAKS</span>
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/50">
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

        <a
          href="https://www.linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-[#8b5cf6]"
        >
          <LinkedinIcon className="h-4 w-4" />
          Engineered &amp; Secured by AbhishekKTech
        </a>
      </div>

      {/* Privacy Policy */}
      <Dialog
        open={open === "privacy"}
        onOpenChange={(o) => !o && setOpen(null)}
      >
        <DialogContent className="border-white/10 bg-[#0B0F19] text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Privacy Policy</DialogTitle>
            <DialogDescription className="text-white/55">
              How we handle your data.
            </DialogDescription>
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
              generate your report and is never sold or shared with third
              parties.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Disclaimer */}
      <Dialog
        open={open === "disclaimer"}
        onOpenChange={(o) => !o && setOpen(null)}
      >
        <DialogContent className="border-white/10 bg-[#0B0F19] text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Disclaimer</DialogTitle>
            <DialogDescription className="text-white/55">
              Please read carefully.
            </DialogDescription>
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

      {/* Contact / Appeal */}
      <Dialog
        open={open === "contact"}
        onOpenChange={(o) => !o && setOpen(null)}
      >
        <DialogContent className="border-white/10 bg-[#0B0F19] text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">
              Contact / Appeal Form
            </DialogTitle>
            <DialogDescription className="text-white/55">
              Report an issue or appeal a Scam Wall listing.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setOpen(null)
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label className="text-white/80">Your Name</Label>
              <Input
                type="text"
                required
                placeholder="e.g. Abhishek Kumar"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-white/80">Your Email</Label>
              <Input
                type="email"
                required
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-white/80">
                Company Name (If applicable)
              </Label>
              <Input
                type="text"
                placeholder="e.g. Stellar Tech Solutions Pvt Ltd"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-white/80">Message / Appeal Details</Label>
              <Textarea
                required
                rows={4}
                placeholder="Describe your concern or appeal…"
                className={inputClass}
              />
            </div>
            <Button
              type="submit"
              className="h-11 w-full rounded-xl bg-[#8b5cf6] font-semibold text-white hover:bg-[#7c3aed]"
            >
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </footer>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 110-4.14 2.07 2.07 0 010 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}
