"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Trash2, ShieldAlert, History, Loader2, Sparkles, Activity, FileText, CheckCircle2, AlertTriangle } from "lucide-react"

interface DashboardViewProps {
  userEmail: string
  userName?: string
  credits: number
  onNavigateBack: () => void
  onReportDeleted?: (id: number) => void // 👉 Parent ko batane ke liye
}

export function DashboardView({ userEmail, userName, credits, onNavigateBack, onReportDeleted }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<"history" | "reports">("history")
  const [history, setHistory] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const displayName = userName || userEmail.split("@")[0] || "User"

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // 👉 FIX: Fetch karte waqt bhi JWT Token chahiye hota hai
      const token = localStorage.getItem("internleaks_token");
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      };

      const historyRes = await axios.get(`http://localhost:8080/api/v1/scan-history/user/${userEmail}`, config)
      const reportsRes = await axios.get(`http://localhost:8080/api/v1/reports/user/${userEmail}`, config)
      
      setHistory(historyRes.data)
      setReports(reportsRes.data)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (userEmail) {
      fetchData()
    }
  }, [userEmail])

  const handleDelete = async (id: number, type: "history" | "report") => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    // 👉 FIX: Delete karne ke liye Spring Security ko Token dena zaroori hai
    const token = localStorage.getItem("internleaks_token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    };

    try {
      if (type === "history") {
        await axios.delete(`http://localhost:8080/api/v1/scan-history/${id}`, config)
        setHistory(history.filter(item => item.id !== id))
      } else {
        await axios.delete(`http://localhost:8080/api/v1/reports/${id}`, config)
        setReports(reports.filter(item => item.id !== id))
        
        // Agar parent ne function bheja hai, toh usko trigger karo (taaki Scam Wall update ho)
        if (onReportDeleted) {
          onReportDeleted(id)
        }
      }
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Failed to delete. Please try again.")
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header Section */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, <span className="text-[#8b5cf6]">{displayName}</span>! 👋
          </h1>
          <p className="mt-2 text-white/60">Here is a quick overview of your account and activities.</p>
        </div>
        <button
          onClick={onNavigateBack}
          className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          Go to Scanner
        </button>
      </div>

      {/* Premium Stat Cards */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-[#8b5cf6]/20 bg-gradient-to-br from-[#8b5cf6]/10 to-transparent p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8b5cf6]/20 text-[#8b5cf6]">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/60">Available Credits</p>
              <h3 className="text-2xl font-bold text-white">{credits}</h3>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/60">Total Scans Performed</p>
              <h3 className="text-2xl font-bold text-white">{history.length}</h3>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/60">Scam Reports Submitted</p>
              <h3 className="text-2xl font-bold text-white">{reports.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styled Tabs */}
      <div className="mb-6 inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${
            activeTab === "history" ? "bg-[#8b5cf6] text-white shadow-lg shadow-[#8b5cf6]/25" : "text-white/60 hover:text-white"
          }`}
        >
          <History className="h-4 w-4" /> Scan History
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${
            activeTab === "reports" ? "bg-[#8b5cf6] text-white shadow-lg shadow-[#8b5cf6]/25" : "text-white/60 hover:text-white"
          }`}
        >
          <FileText className="h-4 w-4" /> My Scam Reports
        </button>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[400px] rounded-2xl border border-white/10 bg-[#0B0F19] p-6 shadow-2xl">
        {isLoading ? (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#8b5cf6]" />
            <p className="text-sm text-white/50">Fetching your data...</p>
          </div>
        ) : activeTab === "history" ? (
          // --- HISTORY TAB ---
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {history.length === 0 ? (
              <div className="col-span-full flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5">
                <History className="mb-2 h-8 w-8 text-white/20" />
                <p className="text-white/50">No scan history found yet.</p>
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-5 transition-all hover:border-[#8b5cf6]/50 hover:bg-white/10">
                  <div>
                    <div className="mb-3 flex items-start justify-between">
                      <h3 className="font-bold text-white truncate max-w-[200px]">{item.companyName}</h3>
                      <button 
                        onClick={() => handleDelete(item.id, "history")}
                        className="text-white/30 transition-colors hover:text-red-400 opacity-0 group-hover:opacity-100"
                        title="Delete record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="mb-3 flex items-center gap-2">
                      {item.riskPercentage > 50 ? (
                        <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-semibold text-red-400"><AlertTriangle className="h-3 w-3"/> High Risk ({item.riskPercentage}%)</span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400"><CheckCircle2 className="h-3 w-3"/> Safe ({item.riskPercentage}%)</span>
                      )}
                    </div>
                    
                    <p className="text-sm leading-relaxed text-white/60 line-clamp-3">
                      {item.verdict}
                    </p>
                  </div>
                  <div className="mt-4 border-t border-white/10 pt-3 text-xs text-white/30">
                    Scanned on: {new Date(item.reportedAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // --- REPORTS TAB ---
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reports.length === 0 ? (
              <div className="col-span-full flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5">
                <FileText className="mb-2 h-8 w-8 text-white/20" />
                <p className="text-white/50">You haven't submitted any reports to the Scam Wall.</p>
              </div>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-5 transition-all hover:border-red-500/30 hover:bg-white/10">
                  <div>
                    <div className="mb-3 flex items-start justify-between">
                      {/* 👉 FIX: Purane database format ke hisaab se dono check kar rahe hain */}
                      <h3 className="font-bold text-white truncate max-w-[200px]">
                        {report.company?.name || report.companyName || "Unknown Company"}
                      </h3>
                      <button 
                        onClick={() => handleDelete(report.id, "report")}
                        className="text-white/30 transition-colors hover:text-red-400 opacity-0 group-hover:opacity-100"
                        title="Delete report"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-semibold text-red-400">
                      <ShieldAlert className="h-3 w-3"/> {report.scamType || "Suspicious"}
                    </span>
                    
                    <p className="text-sm leading-relaxed text-white/60 line-clamp-3">
                      {report.description}
                    </p>
                  </div>
                  <div className="mt-4 border-t border-white/10 pt-3 text-xs text-white/30">
                    Reported on: {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}