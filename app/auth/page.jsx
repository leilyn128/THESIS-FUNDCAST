"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { supabase } from "../../lib/supabaseClient"
import LoginLayout from "../../components/layouts/authlayout"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSignup, setIsSignup] = useState(false)

  const router = useRouter()

  const DEFAULT_EMAIL = "treasurer@gmail.com"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // 🔒 Treasurer-only email restriction
      if (email.trim().toLowerCase() !== DEFAULT_EMAIL.toLowerCase()) {
        setError(`Only the email "${DEFAULT_EMAIL}" is allowed.`)
        setLoading(false)
        return
      }

      if (isSignup) {
        // 🆕 Signup
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) throw error

        alert("Signup successful! You may now log in.")
        setIsSignup(false)
        setEmail("")
        setPassword("")
      } else {
        // 🔑 Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        if (data.session) {
          localStorage.setItem("token", data.session.access_token)
          router.push("/dashboard")
        }
      }
    } catch (err) {
      setError(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  // 🔁 Forgot Password
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email first.")
      return
    }

    if (email.trim().toLowerCase() !== DEFAULT_EMAIL.toLowerCase()) {
      setError(`Only the email "${DEFAULT_EMAIL}" is allowed.`)
      return
    }

    try {
      setLoading(true)
      setError("")

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      alert("Password reset link sent to your email.")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoginLayout>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

          {/* LOGO */}
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.png"
              alt="App Logo"
              width={90}
              height={90}
              priority
            />
          </div>

          <h1 className="text-3xl font-bold mb-6 text-center text-green-600">
            {isSignup ? "Create Treasurer Account" : "Welcome Treasurer!"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="treasurer@gmail.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder={isSignup ? "Create a password" : "Enter your password"}
              />
            </div>

            {/* Forgot Password */}
            {!isSignup && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-green-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white py-3 rounded-lg text-lg font-medium hover:bg-green-600 transition disabled:opacity-50"
            >
              {loading
                ? isSignup
                  ? "Signing up..."
                  : "Logging in..."
                : isSignup
                ? "Sign Up"
                : "Login"}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-sm text-center mt-4">
            {isSignup ? "Already have an account?" : "No account yet?"}{" "}
            <button
              onClick={() => {
                setIsSignup(!isSignup)
                setError("")
                setEmail("")
                setPassword("")
              }}
              className="text-green-600 font-medium hover:underline"
            >
              {isSignup ? "Login here" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </LoginLayout>
  )
}
