"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CostInputSheetProps {
  isOpen: boolean
  defaultCost: number
  unit: string
  onConfirm: (cost: number) => void
  onClose: () => void
}

export function CostInputSheet({
  isOpen,
  defaultCost,
  unit,
  onConfirm,
  onClose,
}: CostInputSheetProps) {
  const [cost, setCost] = useState(String(defaultCost))
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset to default whenever sheet opens
  useEffect(() => {
    if (isOpen) {
      setCost(String(defaultCost))
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, defaultCost])

  const handleConfirm = () => {
    onConfirm(Number(cost) || 0)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-zinc-900 border-t border-zinc-800 px-6 pt-5 pb-10"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Handle */}
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-zinc-700" />

            <p className="mb-1 text-sm text-zinc-400">Log with custom cost</p>
            <p className="mb-4 text-xs text-zinc-600">
              Default: {defaultCost} per {unit}
            </p>

            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="number"
                min={0}
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="flex-1 rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-3 text-white text-base focus:outline-none focus:border-zinc-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleConfirm()
                  if (e.key === "Escape") onClose()
                }}
              />
              <button
                type="button"
                onClick={handleConfirm}
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition active:scale-95"
              >
                Log
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}