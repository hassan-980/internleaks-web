"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { AnalysisDetail } from "@/components/analysis-detail"
import { AlertOctagon, Download, RotateCcw, CheckCircle2 } from "lucide-react"
import type { ScamReport } from "@/lib/internleaks-data"

interface ResultViewProps {
  report: ScamReport
  onReport: (report: ScamReport) => void
  onScanAnother: () => void
  isValidDocument?: boolean
}

export function ResultView({
  report,
  onReport,
  onScanAnother,
  isValidDocument = true,
}: ResultViewProps) {
  const [confirmed, setConfirmed] = useState(false)
  const [reported, setReported] = useState(false)

  const handleReport = () => {
    onReport(report)
    setReported(true)
  }

  const handleDownload = () => {
    const lines = [
      "INTERNLEAKS — AI RISK REPORT",
      "================================",
      `Report ID: ${report.id}`,
      `Company: ${report.companyName}`,
      `Website: ${report.companyWebsite || "N/A"}`,
      `HR Email Domain: ${report.hrEmailDomain}`,
      `Payment Demanded: ${report.paymentDemanded}`,
      `Interview Taken: ${report.interviewTaken}`,
      `Risk: ${report.riskPercentage}%`,
      `Verdict: ${report.verdict}`,
      "",
      "Red Flags:",
      ...report.redFlags.map((f, i) => `  ${i + 1}. ${f}`),
      "",
      `User Feedback: ${report.userSuspicionFeedback || "N/A"}`,
      `Generated: ${report.reportedAt}`,
    ]
    const blob = new Blob([lines.join("\n")], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `internleaks-report-${report.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8">
        <p className="mb-6 text-xs font-semibold uppercase tracking-wider text-[#8b5cf6]">
          AI Risk Profile
        </p>

        <AnalysisDetail report={report} />

        {/* Junk Document Blocker ya Privacy Confirm */}
        {!isValidDocument ? (
          <div className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center backdrop-blur-sm">
            <p className="text-sm font-semibold text-amber-400">⚠️ Invalid Document Detected</p>
            <p className="mt-1 text-sm text-white/70">This does not appear to be a valid offer letter or HR email. Reporting to the Scam Wall has been disabled to maintain community data quality.</p>
          </div>
        ) : (
          <label className="mt-8 flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <Checkbox
              checked={confirmed}
              onCheckedChange={(c) => setConfirmed(c === true)}
              className="mt-0.5 border-white/30 data-[state=checked]:border-[#8b5cf6] data-[state=checked]:bg-[#8b5cf6]"
            />
            <span className="text-sm leading-relaxed text-white/70">
              I confirm this is my document. I understand my identity will remain 100% hidden on the public Scam Wall.
            </span>
          </label>
        )}

        {/* Action buttons */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={handleReport}
            disabled={!confirmed || reported || !isValidDocument} 
            size="lg"
            className="h-12 flex-1 rounded-xl bg-[#ef4444] text-base font-semibold text-white shadow-[0_0_30px_-6px_#ef4444] hover:bg-[#dc2626] disabled:opacity-40 disabled:shadow-none"
          >
            {reported ? (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Reported to Scam Wall
              </>
            ) : (
              <>
                <AlertOctagon className="mr-2 h-5 w-5" />
                Report to Scam Wall
              </>
            )}
          </Button>
          <Button
            onClick={handleDownload}
            size="lg"
            variant="outline"
            className="h-12 flex-1 rounded-xl border-white/15 bg-white/5 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Full Report PDF
          </Button>
        </div>

        <button
          onClick={onScanAnother}
          className="mt-5 flex w-full items-center justify-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
          Scan Another Document
        </button>
      </div>
    </section>
  )
}