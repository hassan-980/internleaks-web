"use client"

import { RiskGauge } from "@/components/risk-gauge"
import {
  AlertTriangle,
  Mail,
  CreditCard,
  Languages,
  CircleUser,
  Building2,
  Globe,
} from "lucide-react"
import type { ScamReport, RiskMetric } from "@/lib/internleaks-data"

function metricColor(p: number) {
  if (p >= 75) return "#ef4444"
  if (p >= 45) return "#f59e0b"
  return "#34d399"
}

// Verdict ke box ka color decide karne ke liye function
function getVerdictClasses(risk: number) {
  if (risk >= 75) return "border-[#ef4444]/30 bg-[#ef4444]/10 text-[#ef4444]"; // Red for High Risk
  if (risk >= 45) return "border-amber-400/30 bg-amber-400/10 text-amber-400"; // Amber for Medium Risk
  return "border-[#34d399]/30 bg-[#34d399]/10 text-[#34d399]"; // Green for Safe
}

export function MetricBar({ metric }: { metric: RiskMetric }) {
  const color = metricColor(metric.value)
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-white/70">{metric.label}</span>
        <span className="font-semibold" style={{ color }}>
          {metric.value}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${metric.value}%`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}aa`,
          }}
        />
      </div>
    </div>
  )
}

// Derive metric breakdown from the report payload
export function deriveMetrics(report: ScamReport): RiskMetric[] {
  const emailRisk =
    /gmail|yahoo|outlook|hotmail/i.test(report.hrEmailDomain) ? 90 : 55
  const paymentRisk =
    report.paymentDemanded === "Yes"
      ? 95
      : report.paymentDemanded === "Not Sure"
        ? 60
        : 25
  const langRisk = Math.min(
    98,
    Math.max(40, Math.round(report.riskPercentage * 0.8)),
  )
  return [
    { label: "Email Domain Risk", value: emailRisk },
    { label: "Payment Request Risk", value: paymentRisk },
    { label: "Language / Grammar Risk", value: langRisk },
  ]
}

interface AnalysisDetailProps {
  report: ScamReport
  compact?: boolean
}

export function AnalysisDetail({ report, compact = false }: AnalysisDetailProps) {
  const metrics = deriveMetrics(report)

  return (
    <div className="flex flex-col gap-6">

      {/* Gauge + verdict (UPDATED PREMIUM LAYOUT) */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        
        {/* Left Side: Risk Circle */}
        <div className="shrink-0">
          <RiskGauge percentage={report.riskPercentage} size={compact ? 150 : 180} />
        </div>

        {/* Right Side: Company Details & Dynamic Alert Box */}
        <div className="flex min-w-0 flex-1 flex-col items-center text-center sm:items-start sm:text-left">
          
          <h3 className="text-2xl font-bold text-white break-words">
            {report.companyName}
          </h3>
          
          {report.companyWebsite && (
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-white/50">
              <Globe className="h-4 w-4 shrink-0" />
              <span className="truncate">{report.companyWebsite}</span>
            </p>
          )}

          {/* Dynamic Verdict Alert Box */}
          <div className={`mt-4 w-full rounded-xl border p-4 shadow-sm ${getVerdictClasses(report.riskPercentage)}`}>
            <div className="mb-1.5 flex items-center justify-center gap-2 font-bold sm:justify-start">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>AI Verdict</span>
            </div>
            <p className="text-sm leading-relaxed opacity-90 text-pretty">
              {report.verdict}
            </p>
          </div>

        </div>
      </div>

      {/* User context summary */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
          User-Provided Context
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ContextItem
            icon={<Building2 className="h-4 w-4" />}
            label="Company"
            value={report.companyName}
          />
          <ContextItem
            icon={<Mail className="h-4 w-4" />}
            label="HR Email Domain"
            value={report.hrEmailDomain}
          />
          <ContextItem
            icon={<CreditCard className="h-4 w-4" />}
            label="Payment Demanded"
            value={report.paymentDemanded}
          />
          <ContextItem
            icon={<CircleUser className="h-4 w-4" />}
            label="Interview Taken"
            value={report.interviewTaken}
          />
        </div>
        {report.userSuspicionFeedback && (
          <div className="mt-3 rounded-lg border border-white/10 bg-[#0B0F19]/60 p-3">
            <p className="text-xs font-medium text-white/40">
              Why the user is suspicious
            </p>
            <p className="mt-1 text-sm italic text-white/70">
              &ldquo;{report.userSuspicionFeedback}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Metrics breakdown */}
      <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
          Metrics Breakdown
        </p>
        {metrics.map((m) => (
          <MetricBar key={m.label} metric={m} />
        ))}
      </div>

      {/* Evidence timeline */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/40">
          <Languages className="h-3.5 w-3.5" />
          AI-Detected Red Flags
        </p>
        <ol className="relative ml-3 border-l border-[#ef4444]/30">
          {report.redFlags.map((flag, i) => (
            <li key={i} className="mb-5 ml-5 last:mb-0">
              <span className="absolute -left-[7px] flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ef4444] shadow-[0_0_10px_#ef4444]" />
              <p className="text-sm leading-relaxed text-white/80">{flag}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function ContextItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-[#8b5cf6]">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-white/40">{label}</p>
        <p className="truncate text-sm font-medium text-white/85">
          {value || "—"}
        </p>
      </div>
    </div>
  )
}
