"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function ResetPasswordForm() {

  const router = useRouter()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  // Ensure the page was opened via Supabase reset link
  useEffect(() => {
    const hash = window.location.hash

    if (!hash.includes("access_token")) {
      router.replace("/login")
    }
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setError("")
    setSuccess("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setSuccess("Password updated successfully. Redirecting to login...")

    setTimeout(() => {
      router.replace("/login")
    }, 1500)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
    >

      <FieldGroup>

        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Set a new password</h1>
          <p className="text-sm text-muted-foreground">
            Enter a new password for your account.
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        {success && (
          <p className="text-sm text-green-500 text-center">{success}</p>
        )}

        <Field>
          <FieldLabel htmlFor="password">New Password</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="Enter new password"
            className="bg-background"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm new password"
            className="bg-background"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Field>

        <Field>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </Field>

        <FieldDescription className="text-center">
          Back to <a href="/login">login</a>
        </FieldDescription>

      </FieldGroup>

    </form>
  )
}