"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Lock, Sparkles } from "lucide-react"
import type { TriState, WizardInput } from "@/lib/internleaks-data"

interface WizardViewProps {
  input: WizardInput
  onChange: (input: WizardInput) => void
  onSubmit: () => void
}

const triOptions: TriState[] = ["Yes", "No", "Not Sure"]

function PillGroup({
  value,
  onSelect,
}: {
  value: TriState | ""
  onSelect: (v: TriState) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {triOptions.map((opt) => {
        const active = value === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
              active
                ? "border-[#8b5cf6] bg-[#8b5cf6] text-white shadow-[0_0_18px_-4px_#8b5cf6]"
                : "border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

const inputClass =
  "border-white/15 bg-white/5 text-white placeholder:text-white/30 focus-visible:border-[#8b5cf6] focus-visible:ring-[#8b5cf6]/30"

export function WizardView({ input, onChange, onSubmit }: WizardViewProps) {
  const set = (patch: Partial<WizardInput>) => onChange({ ...input, ...patch })
  const canSubmit = input.companyName.trim().length > 0

  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8">
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-xs text-emerald-300">
          <Lock className="h-3.5 w-3.5 shrink-0" />
          Your answers remain strictly anonymous.
        </div>

        <h2 className="text-2xl font-bold text-white">Tell us the context</h2>
        <p className="mt-1 text-sm text-white/50">
          A few details help our AI give you a far more accurate verdict.
        </p>

        <div className="mt-8 flex flex-col gap-6">
          {/* Q1 */}
          <div className="flex flex-col gap-2">
            <Label className="text-white/80">
              Company Name <span className="text-[#ef4444]">*</span>
            </Label>
            <Input
              value={input.companyName}
              onChange={(e) => set({ companyName: e.target.value })}
              placeholder="e.g. Stellar Tech Solutions Pvt Ltd"
              className={inputClass}
            />
          </div>

          {/* Q2 */}
          <div className="flex flex-col gap-2">
            <Label className="text-white/80">
              Company Website{" "}
              <span className="text-white/40">(optional)</span>
            </Label>
            <Input
              value={input.companyWebsite}
              onChange={(e) => set({ companyWebsite: e.target.value })}
              placeholder="e.g. company-careers.net"
              className={inputClass}
            />
          </div>

          {/* Q3 */}
          <div className="flex flex-col gap-2.5">
            <Label className="text-white/80">
              Did they ask for any payment or security deposit?
            </Label>
            <PillGroup
              value={input.paymentDemanded}
              onSelect={(v) => set({ paymentDemanded: v })}
            />
          </div>

          {/* Q4 */}
          <div className="flex flex-col gap-2.5">
            <Label className="text-white/80">
              Have they taken any proper interview or assessment?
            </Label>
            <PillGroup
              value={input.interviewTaken}
              onSelect={(v) => set({ interviewTaken: v })}
            />
          </div>

          {/* Q5 */}
          <div className="flex flex-col gap-2">
            <Label className="text-white/80">
              What is the HR&apos;s email domain?
            </Label>
            <Input
              value={input.hrEmailDomain}
              onChange={(e) => set({ hrEmailDomain: e.target.value })}
              placeholder="e.g. hr@company.com or recruiter@gmail.com"
              className={inputClass}
            />
          </div>

          {/* Q6 */}
          <div className="flex flex-col gap-2">
            <Label className="text-white/80">
              Why do you feel this is a scam?
            </Label>
            <Textarea
              value={input.userSuspicionFeedback}
              onChange={(e) =>
                set({ userSuspicionFeedback: e.target.value })
              }
              placeholder="Describe anything that felt off — urgency, fees, grammar, unrealistic stipend…"
              rows={4}
              className={inputClass}
            />
          </div>
        </div>

        <Button
          onClick={onSubmit}
          disabled={!canSubmit}
          size="lg"
          className="mt-8 h-12 w-full rounded-xl bg-[#8b5cf6] text-base font-semibold text-white shadow-[0_0_30px_-6px_#8b5cf6] hover:bg-[#7c3aed] disabled:opacity-40 disabled:shadow-none"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Start AI Investigation
        </Button>
        {!canSubmit && (
          <p className="mt-2 text-center text-xs text-white/40">
            Company name is required to continue.
          </p>
        )}
      </div>
    </section>
  )
}
