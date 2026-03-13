"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        router.push("/login");
        return;
      }

      const data = await res.json();
      setUser(data);
    };

    loadUser();
  }, [router]);

  async function handleLogout() {
    const token = localStorage.getItem("access_token");

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.removeItem("access_token");
    router.push("/login");
  }

  if (!user) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="mt-6">
        <p>Welcome:</p>
        <p className="font-semibold">{user.email}</p>
      </div>

      <button
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}