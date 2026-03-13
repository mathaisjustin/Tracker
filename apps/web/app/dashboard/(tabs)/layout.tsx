import BottomNav from "@/components/dashboard/BottomNav"

export default function DashboardTabsLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (

    <div className="min-h-screen bg-black text-white">

      <div className="pb-24 p-4">
        {children}
      </div>

      <BottomNav />

    </div>

  )

}