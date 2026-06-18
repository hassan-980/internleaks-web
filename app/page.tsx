"use client"

import { AdminView } from "@/components/admin-view"
import { useState, useEffect } from "react"
import axios from "axios"
import { Navbar } from "@/components/navbar"
import { LandingView } from "@/components/landing-view"
import { WizardView } from "@/components/wizard-view"
import { AnalyzingView } from "@/components/analyzing-view"
import { ResultView } from "@/components/result-view"
import { ScamWallView } from "@/components/scam-wall-view"
import { AuthModal } from "@/components/auth-modal"
import { EditProfileModal } from "@/components/edit-profile-modal"
import { Footer } from "@/components/footer"
import { DashboardView } from "@/components/dashboard-view"
import {
  dummyScamWall,
  emptyWizardInput,
  type ScamReport,
  type WizardInput,
} from "@/lib/internleaks-data"

type View = "landing" | "wizard" | "analyzing" | "result" | "wall" | "dashboard" | "admin"

export default function Page() {
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [view, setView] = useState<View>("landing")
  const [credits, setCredits] = useState(2)
  const [authOpen, setAuthOpen] = useState(false)
  const [wizard, setWizard] = useState<WizardInput>(emptyWizardInput)
  const [currentReport, setCurrentReport] = useState<ScamReport | null>(null)

  const [reports, setReports] = useState<ScamReport[]>([])
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isValidDoc, setIsValidDoc] = useState<boolean>(true)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  const [userEmail, setUserEmail] = useState<string>("")
  const [userName, setUserName] = useState<string>("")
  const activeTab: "scanner" | "wall" = view === "wall" ? "wall" : "scanner"

  // 👉 Loading state for Scam Wall
  const [isWallLoading, setIsWallLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("internleaks_token")
    const savedCredits = localStorage.getItem("internleaks_credits")
    const savedEmail = localStorage.getItem("internleaks_user_email")
    const savedName = localStorage.getItem("internleaks_user_name")
    
    if (token) {
      setIsLoggedIn(true)
      if (savedEmail) setUserEmail(savedEmail)
      if (savedName) setUserName(savedName)
      if (savedCredits) setCredits(parseInt(savedCredits))
      else setCredits(4)
    }
  }, [])

  useEffect(() => {
    const fetchAllReports = async () => {
      setIsWallLoading(true) 
      try {
        // 👉 FIX: Yahan bhi '/reports' ki jagah '/reports/all' kar diya
        const response = await axios.get("http://localhost:8080/api/v1/reports/all");
        
        const sortedData = response.data.sort((a: any, b: any) => b.id - a.id);
        setReports(sortedData); 
      } catch (error) {
        console.error("Failed to fetch Scam Wall data:", error);
      } finally {
        setIsWallLoading(false) 
      }
    };
    fetchAllReports();
  }, []);

  const handleVerify = () => {
    if (credits > 0) setView("wizard")
    else {
      if (isLoggedIn) alert("⚠️ You have 0 credits left! Razorpay integration to buy more credits is coming soon.")
      else setAuthOpen(true)
    }
  }

  const handleAuthenticated = (authMode: "signin" | "signup", backendCredits: number) => {
    setCredits(backendCredits)
    localStorage.setItem("internleaks_credits", backendCredits.toString())
    
    const savedEmail = localStorage.getItem("internleaks_user_email")
    if (savedEmail) setUserEmail(savedEmail)
    const savedName = localStorage.getItem("internleaks_user_name")
    if (savedName) setUserName(savedName)

    setIsLoggedIn(true)
    setAuthOpen(false)
    setView("wizard")
  }

  const handleLogout = () => {
    localStorage.removeItem("internleaks_token")
    localStorage.removeItem("internleaks_credits")
    localStorage.removeItem("internleaks_user_email")
    localStorage.removeItem("internleaks_user_name")

    setIsLoggedIn(false)
    setCredits(2)
    setUserEmail("")
    setUserName("")
    setView("landing")
  }

  const handleWizardSubmit = async () => {
    if (credits <= 0) {
      if (isLoggedIn) alert("⚠️ You have 0 credits left! Razorpay integration to buy more credits is coming soon.")
      else setAuthOpen(true)
      return
    }

    let nextCredits = 0;
    setCredits((c) => {
      nextCredits = Math.max(0, c - 1);
      localStorage.setItem("internleaks_credits", nextCredits.toString());
      
      const email = localStorage.getItem("internleaks_user_email");
      const token = localStorage.getItem("internleaks_token");
      if (token && email) {
        axios.post("http://localhost:8080/api/v1/auth/update-credits", {
          email: email,
          credits: nextCredits
        }).catch(err => console.error("Failed to sync credits with database:", err));
      }
      return nextCredits;
    });

    setView("analyzing")

    try {
      // ==========================================
      // 🛑 AI BYPASS (DUMMY SCANNER)
      // ==========================================
      
      // 2 seconds ka fake loading animation
      await new Promise(resolve => setTimeout(resolve, 2000)); 

      // Hamesha yeh Scam report generate hogi
      const aiResult = {
        riskPercentage: 92,
        verdict: "[TESTING MODE] This is a mocked high-risk scam report to test the Scam Wall submission.",
        redFlags: [
          "Demanding money or security deposit for onboarding.",
          "Gmail/Yahoo email used instead of a corporate domain.",
          "Unrealistic stipend for the required role."
        ],
        isValidDocument: true
      };

      console.log("Mocked AI Analysis:", aiResult)

      const validCheck = aiResult.isValidDocument !== undefined ? aiResult.isValidDocument : true
      setIsValidDoc(validCheck)

      const finalReport: ScamReport = {
        id: Date.now(),
        companyName: wizard.companyName || "Test Scam Company",
        companyWebsite: wizard.companyWebsite,
        paymentDemanded: wizard.paymentDemanded || "Not Sure",
        interviewTaken: wizard.interviewTaken || "Not Sure",
        hrEmailDomain: wizard.hrEmailDomain,
        userSuspicionFeedback: wizard.userSuspicionFeedback,
        riskPercentage: aiResult.riskPercentage, 
        verdict: aiResult.verdict,
        redFlags: aiResult.redFlags || [],
        reportedAt: new Date().toISOString().slice(0, 19),
        reportCount: 1,
      }

      setCurrentReport(finalReport)

      // Dashboard ki history mein save karne ke liye call
      if (isLoggedIn && userEmail) {
        try {
          const token = localStorage.getItem("internleaks_token"); 

          const historyPayload = {
            ...finalReport,
            id: null, // 🔥 FIX: ID ko null kar do taaki Spring auto-generate kare
            userEmail: userEmail,
            redFlags: finalReport.redFlags.join(" | "), 
            verdict: finalReport.verdict.length > 240 
                     ? finalReport.verdict.substring(0, 240) + "..." 
                     : finalReport.verdict
          }

          await axios.post("http://localhost:8080/api/v1/scan-history/add", historyPayload, {
            headers: { Authorization: `Bearer ${token}` }
          })
        } catch (err) {
          console.error("Failed to save history to DB:", err)
        }
      }

    } catch (error) {
      console.error("AI Analysis Failed:", error)
      alert("Something went wrong with the scanner.")
      setView("landing")
    }
  }

  const handleReportToWall = async (report: ScamReport) => {
    try {
      const safeDescription = `AI Verdict: ${report.verdict} | Red Flags: ${report.redFlags.join(' ')}`
      const finalDescription = safeDescription.length > 240 ? safeDescription.substring(0, 240) + "..." : safeDescription;

      const backendPayload = {
        userEmail: userEmail,
        companyName: report.companyName || "Unknown Company",
        websiteUrl: report.companyWebsite || "Not Provided",
        scamType: report.riskPercentage > 50 ? "High Risk Fraud" : "Suspicious",
        description: finalDescription 
      }

      const response = await axios.post("http://localhost:8080/api/v1/reports/add", backendPayload)
      
      if (response.status === 200 || response.status === 201) {
        console.log("Data successfully saved in Spring Boot Database!", response.data)
        setReports((prev) => [report, ...prev])
        alert("Report submitted successfully to the Scam Wall!")
      }
    } catch (error: any) {
      console.error("Backend connection error:", error)
      if (error.response) {
        alert(`🚨 SERVER ERROR ${error.response.status}: Backend request fail ho gayi. Console dekho!`);
      } else if (error.request) {
        alert(`🚨 NETWORK ERROR: Spring Boot server se connect nahi ho raha.`);
      } else {
        alert(`🚨 ERROR: ${error.message}`);
      }
    }
  }

  const handleScanAnother = () => {
    setWizard(emptyWizardInput)
    setCurrentReport(null)
    setView("landing")
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0F19]">

      <Navbar
        activeTab={activeTab} 
        credits={credits}
        isLoggedIn={isLoggedIn} 
        userEmail={userEmail} 
        userName={userName} 
        onNavigate={(v) => setView(v)}
        onOpenAuth={() => setAuthOpen(true)}
        onLogout={handleLogout}
        onOpenDashboard={() => setView("dashboard")}
        onOpenEditProfile={() => setEditProfileOpen(true)}
      />

      <main className="flex-1">
        <div key={view} className="animate-float-up">
          {view === "landing" && (
            <LandingView 
              onVerify={handleVerify} 
              onFileSelect={(file) => setSelectedFile(file)}
            />
          )}

          {view === "wizard" && (
            <WizardView
              input={wizard}
              onChange={setWizard}
              onSubmit={handleWizardSubmit}
            />
          )}

          {view === "analyzing" && (
            <AnalyzingView onComplete={() => setView("result")} />
          )}

          {view === "result" && currentReport && (
            <ResultView
              report={currentReport}
              onReport={handleReportToWall}
              onScanAnother={handleScanAnother}
              isValidDocument={isValidDoc} 
            />
          )}

          {/* 👉 YAHAN isLoading PASS KIYA HAI AUR TYPE ERROR FIX KIYA HAI */}
          {view === "wall" && <ScamWallView reports={reports as any} isLoading={isWallLoading} />}
          
          {view === "dashboard" && (
            <DashboardView 
              userEmail={userEmail} 
              userName={userName}
              credits={credits}
              onNavigateBack={() => setView("landing")} 
              onReportDeleted={(deletedId) => {
                setReports((prev) => prev.filter((r) => r.id !== deletedId))
              }}
            />
          )}

          {view === "admin" && (
            <AdminView 
              onNavigateBack={() => setView("landing")} 
            />
          )}
        </div>
      </main>

      <Footer />

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onAuthenticated={handleAuthenticated}
      />

      <EditProfileModal
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
        userEmail={userEmail}
        onProfileUpdated={(newName) => {
            setUserName(newName)
            localStorage.setItem("internleaks_user_name", newName)
        }}
      />
    </div>
  )
}

function computeRisk(w: WizardInput): number { return 50 }
function verdictFor(risk: number): string { return "Unknown" }
function buildRedFlags(w: WizardInput): string[] { return [] }