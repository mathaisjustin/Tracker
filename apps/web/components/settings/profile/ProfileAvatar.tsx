"use client"

export default function ProfileAvatar() {
  return (
    <div className="flex flex-col items-center gap-3 mt-6">
      
      <div className="w-24 h-24 rounded-full bg-pink-600 flex items-center justify-center text-2xl font-semibold">
        JM
      </div>

      <button className="text-pink-500 text-sm">
        Change photo
      </button>
    </div>
  )
}