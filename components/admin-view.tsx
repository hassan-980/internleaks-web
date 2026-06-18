"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Trash2, ShieldCheck, Loader2, Search, User, CalendarDays, AlertTriangle } from "lucide-react"

interface AdminViewProps {
  onNavigateBack: () => void
}

export function AdminView({ onNavigateBack }: AdminViewProps) {
  const [reports, setReports] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchAllReports = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("internleaks_token")
      const config = { headers: token ? { Authorization: `Bearer ${token}` } : {} }

      // Fetch ALL reports from the database
      const response = await axios.get("http://localhost:8080/api/v1/reports/all", config)
      const sortedData = response.data.sort((a: any, b: any) => b.id - a.id)
      setReports(sortedData)
    } catch (error) {
      console.error("Admin fetch error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAllReports()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("🚨 ADMIN ACTION: Are you sure you want to permanently delete this report from the database?")) return;

    try {
      const token = localStorage.getItem("internleaks_token")
      const config = { headers: token ? { Authorization: `Bearer ${token}` } : {} }

      await axios.delete(`http://localhost:8080/api/v1/reports/${id}`, config)
      setReports(reports.filter(report => report.id !== id))
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Failed to delete report. Check backend logs.")
    }
  }

  // Search filter logic
  const filteredReports = reports.filter(report => {
    const searchLower = searchTerm.toLowerCase()
    return (
      (report.company?.name || report.companyName || "").toLowerCase().includes(searchLower) ||
      (report.userEmail || "").toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Admin Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
            <ShieldCheck className="h-8 w-8 text-[#8b5cf6]" />
            Admin Command Center
          </h1>
          <p className="mt-2 text-white/60">Manage all community-submitted scam reports.</p>
        </div>
        <button
          onClick={onNavigateBack}
          className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          Exit Admin Panel
        </button>
      </div>

      {/* Stats & Search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 rounded-xl border border-[#8b5cf6]/20 bg-[#8b5cf6]/10 px-5 py-3 text-[#8b5cf6]">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-semibold">Total Reports: {reports.length}</span>
        </div>

        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search by Company or User Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none focus:border-[#8b5cf6]/50 focus:ring-1 focus:ring-[#8b5cf6]/50"
          />
        </div>
      </div>

      {/* Admin Data Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F19] shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="border-b border-white/10 bg-white/5 text-white">
              <tr>
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Reported Company</th>
                <th className="px-6 py-4 font-semibold">Submitted By (User)</th>
                <th className="px-6 py-4 font-semibold">Scam Type</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#8b5cf6]" />
                    <p className="mt-2 text-white/50">Loading database records...</p>
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/50">
                    No reports found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-mono text-xs text-white/40">#{report.id}</td>
                    <td className="px-6 py-4 font-medium text-white">
                      {report.company?.name || report.companyName || "Unknown"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                          <User className="h-3 w-3 text-white/60" />
                        </div>
                        <span className="truncate max-w-[150px]" title={report.userEmail}>
                          {report.userEmail || "Anonymous"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        report.scamType?.includes("High") 
                          ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {report.scamType || "Suspicious"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/50">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}