"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabaseClient"

export default function SignupForm({
  className,
  ...props
}: React.FormHTMLAttributes<HTMLFormElement>) {

  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setError("")
    setSuccess("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        }
      }
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setSuccess("Account created successfully. Redirecting to login...")

    setTimeout(() => {
      router.replace("/login")
    }, 1200)
  }
  
  async function handleGoogleSignup() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/dashboard`,
      },
    })
  
    if (error) {
      setError(error.message)
    }
  }
  
  async function handleGithubSignup() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/dashboard`,
      },
    })
  
    if (error) {
      setError(error.message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>

        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        {success && (
          <p className="text-sm text-green-500 text-center">{success}</p>
        )}

        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="Enter Your Full Name"
            className="bg-background"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="Enter Your Email"
            className="bg-background"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="Enter Your Password"
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
            placeholder="Confirm Your Password"
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
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field className="flex flex-col gap-3">

          <Button
            variant="outline"
            type="button"
            className="w-full"
            onClick={handleGoogleSignup}
          >
            Sign up with Google
          </Button>

          <Button
            variant="outline"
            type="button"
            className="w-full"
            onClick={handleGithubSignup}
          >
            Sign up with GitHub
          </Button>

        </Field>

        <FieldDescription className="px-6 text-center">
          Already have an account? <a href="/login">Sign in</a>
        </FieldDescription>

      </FieldGroup>
    </form>
  )
}