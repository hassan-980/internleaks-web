export type TriState = "Yes" | "No" | "Not Sure"

// Mirrors the Java Spring Boot REST API payload.
export interface ScamReport {
  id: number
  companyName: string
  companyWebsite: string
  paymentDemanded: TriState
  interviewTaken: TriState
  hrEmailDomain: string
  userSuspicionFeedback: string
  riskPercentage: number
  verdict: string
  redFlags: string[]
  reportedAt: string // ISO LocalDateTime
  reportCount: number
}

// Wizard form state (subset of the report captured from the user)
export interface WizardInput {
  companyName: string
  companyWebsite: string
  paymentDemanded: TriState | ""
  interviewTaken: TriState | ""
  hrEmailDomain: string
  userSuspicionFeedback: string
}

export const emptyWizardInput: WizardInput = {
  companyName: "",
  companyWebsite: "",
  paymentDemanded: "",
  interviewTaken: "",
  hrEmailDomain: "",
  userSuspicionFeedback: "",
}

// Metrics breakdown shown on the result dashboard
export interface RiskMetric {
  label: string
  value: number
}

export const dummyScamWall: ScamReport[] = [
  {
    id: 1001,
    companyName: "Stellar Tech Solutions Pvt Ltd",
    companyWebsite: "stellartech-careers.net",
    paymentDemanded: "Yes",
    interviewTaken: "No",
    hrEmailDomain: "stellartech-hr@gmail.com",
    userSuspicionFeedback:
      "They asked me to pay ₹4,999 as a refundable security deposit before joining. No real interview was conducted.",
    riskPercentage: 96,
    verdict: "Confirmed Fraudulent Offer",
    redFlags: [
      "Upfront security deposit of ₹4,999 demanded before onboarding",
      "HR communicated only via a free Gmail address, not a corporate domain",
      "Offer letter issued within 2 hours with zero technical screening",
    ],
    reportedAt: "2026-06-10T14:32:00",
    reportCount: 14,
  },
  {
    id: 1002,
    companyName: "NextGen Global Internships",
    companyWebsite: "nextgen-intern.co",
    paymentDemanded: "Yes",
    interviewTaken: "Not Sure",
    hrEmailDomain: "careers@nextgen-intern.co",
    userSuspicionFeedback:
      "Promised ₹40,000/month stipend for a fresher with no experience, but wanted a registration fee first.",
    riskPercentage: 91,
    verdict: "High Probability Scam",
    redFlags: [
      "Unrealistic stipend offered to candidates with no experience",
      "Mandatory 'registration fee' requested via UPI",
      "Domain registered only 3 weeks ago",
    ],
    reportedAt: "2026-06-09T09:15:00",
    reportCount: 9,
  },
  {
    id: 1003,
    companyName: "Oceanic Data Labs",
    companyWebsite: "oceanicdatalabs.work",
    paymentDemanded: "Not Sure",
    interviewTaken: "No",
    hrEmailDomain: "hr.oceanic@outlook.com",
    userSuspicionFeedback:
      "The offer letter had several grammatical errors and the company address didn't exist on Maps.",
    riskPercentage: 84,
    verdict: "Likely Fake Offer",
    redFlags: [
      "Multiple grammatical and formatting errors in the offer letter",
      "Company address could not be verified on any registry",
      "Generic webmail used instead of an official domain",
    ],
    reportedAt: "2026-06-07T18:47:00",
    reportCount: 6,
  },
  {
    id: 1004,
    companyName: "Quantum Bridge Consulting",
    companyWebsite: "quantumbridge-jobs.info",
    paymentDemanded: "Yes",
    interviewTaken: "No",
    hrEmailDomain: "support@quantumbridge-jobs.info",
    userSuspicionFeedback:
      "They sent a 'training kit' invoice of ₹7,500 and pressured me to pay within 24 hours.",
    riskPercentage: 94,
    verdict: "Confirmed Fraudulent Offer",
    redFlags: [
      "Paid 'training kit' required before starting the internship",
      "Aggressive 24-hour payment deadline to create urgency",
      "No verifiable LinkedIn presence for the company or recruiters",
    ],
    reportedAt: "2026-06-05T11:05:00",
    reportCount: 11,
  },
  {
    id: 1005,
    companyName: "BrightPath Analytics",
    companyWebsite: "brightpath-careers.xyz",
    paymentDemanded: "No",
    interviewTaken: "Not Sure",
    hrEmailDomain: "talent@brightpath-careers.xyz",
    userSuspicionFeedback:
      "Asked for my Aadhaar, PAN and bank login 'for verification' before any offer was finalized.",
    riskPercentage: 88,
    verdict: "High Probability Scam",
    redFlags: [
      "Requested sensitive bank login credentials during 'verification'",
      "Collected government ID before any formal interview",
      "Suspicious .xyz domain mimicking a legitimate brand",
    ],
    reportedAt: "2026-06-03T16:20:00",
    reportCount: 8,
  },
  {
    id: 1006,
    companyName: "Apex Future Interns",
    companyWebsite: "apexfuture-hiring.online",
    paymentDemanded: "Yes",
    interviewTaken: "No",
    hrEmailDomain: "apex.hiring@yahoo.com",
    userSuspicionFeedback:
      "Offer arrived without me ever applying. They wanted a ₹2,000 'document processing fee'.",
    riskPercentage: 90,
    verdict: "Likely Fake Offer",
    redFlags: [
      "Unsolicited offer for a position never applied to",
      "'Document processing fee' requested upfront",
      "Recruiter used a personal Yahoo email account",
    ],
    reportedAt: "2026-06-01T08:50:00",
    reportCount: 5,
  },
]
