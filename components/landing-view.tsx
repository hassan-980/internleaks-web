"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { UploadCloud, FileText, Lock, ScanLine, X } from "lucide-react"

interface LandingViewProps {
  onVerify: () => void
  onFileSelect?: (file: File) => void // Ye nayi line add kar
}

export function LandingView({ onVerify, onFileSelect }: LandingViewProps) {
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

const handleFiles = (files: FileList | null) => {
    if (files && files.length > 0) {
      setFileName(files[0].name)
      // Ye line add kar taaki page.tsx tak file pohoch jaye 👇
      if (onFileSelect) {
        onFileSelect(files[0])
      }
    }
  }

  return (
    <section className="mx-auto flex max-w-4xl flex-col items-center px-4 py-16 text-center sm:py-24">
      <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 px-4 py-1.5 text-xs font-medium text-[#c4b5fd]">
        <ScanLine className="h-3.5 w-3.5" />
        AI-Powered Internship Offer Verification
      </span>

      <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
        Don&apos;t Get Scammed.{" "}
        <span className="text-[#8b5cf6]">Verify Your Internship Offer.</span>
      </h1>

      <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/60 sm:text-lg">
        Upload your offer letter and let our AI deep-scan it for fraud signals,
        suspicious payment demands, and fake recruiter patterns in seconds.
      </p>

      {/* Upload zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        className={`mt-10 flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 backdrop-blur-md transition-all sm:p-14 ${
          dragging
            ? "border-[#8b5cf6] bg-[#8b5cf6]/10 shadow-[0_0_40px_-8px_#8b5cf6]"
            : "border-white/20 bg-white/5 hover:border-[#8b5cf6]/60 hover:bg-white/[0.07]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {fileName ? (
          <div className="flex items-center gap-3 rounded-xl border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 px-4 py-3">
            <FileText className="h-5 w-5 text-[#8b5cf6]" />
            <span className="max-w-[220px] truncate text-sm font-medium text-white">
              {fileName}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setFileName(null)
              }}
              className="text-white/50 hover:text-white"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#8b5cf6]/15 ring-1 ring-[#8b5cf6]/30">
              <UploadCloud className="h-8 w-8 text-[#8b5cf6]" />
            </span>
            <p className="mt-5 text-base font-semibold text-white">
              Drag &amp; drop your offer letter here
            </p>
            <p className="mt-1 text-sm text-white/50">
              or click to browse — PDF, PNG, JPG, DOCX
            </p>
          </>
        )}
      </div>

      {/* Privacy badge */}
      <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-sm text-emerald-300">
        <Lock className="h-4 w-4 shrink-0" />
        <span className="text-pretty text-left">
          100% Anonymous. Your personal details are encrypted and never shown
          publicly.
        </span>
      </div>

      <Button
        onClick={onVerify}
        size="lg"
        className="mt-8 h-12 rounded-xl bg-[#8b5cf6] px-8 text-base font-semibold text-white shadow-[0_0_30px_-6px_#8b5cf6] hover:bg-[#7c3aed]"
      >
        <ScanLine className="mr-2 h-5 w-5" />
        Verify Offer Now
      </Button>
    </section>
  )
}
