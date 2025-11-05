"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react"
import { login } from "@/app/(dashboard)/configuracion/usuarios/services/auth"

export default function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccess(false)

    // Validation
    const newErrors: { username?: string; password?: string } = {}

    if (!username) {
      newErrors.username = "Ingrese el correo electrónico."
    }

    // if (!password) {
    //   newErrors.password = "Ingrese su contraseña."
    // } else if (password.length < 8) {
    //   newErrors.password = "La contraseña debe tener al menos 8 caracteres."
    // }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      const errorMessage = Object.values(newErrors).join(". ")
      announceToScreenReader(errorMessage)
      return
    }

    setIsLoading(true)

    try {
      await login({ username, password })
      setIsLoading(false)
      setSuccess(true)
      announceToScreenReader("Inicio de sesión exitoso.")
      router.push("/organizaciones")

    } catch (err) {
      setIsLoading(false)
      const anyErr: any = err as any;
      const apiMsg = anyErr?.response?.data?.detail || anyErr?.message || "Error al iniciar sesi�n."
      setErrors({ general: apiMsg })
      announceToScreenReader(apiMsg)
    }
  }

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement("div")
    announcement.setAttribute("role", "status")
    announcement.setAttribute("aria-live", "polite")
    announcement.className = "sr-only"
    announcement.textContent = message
    document.body.appendChild(announcement)
    setTimeout(() => document.body.removeChild(announcement), 1000)
  }

  return (
    <Card
      className="p-6 sm:p-4 min-w-xl bg-transparent border-0 shadow-none fade-up "
    >
      <CardHeader className="space-y-2 p-4">
        <CardTitle className="text-3xl text-center text-balance text-neutral-700">Registro OREDIS</CardTitle>
        <CardDescription className="text-lg text-muted-foreground text-center">
          Ingrese sus credenciales para acceder al sistema.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-6">
          {success && (
            <Alert className="bg-success/10 border-success text-success-foreground" role="alert">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              <AlertDescription className="ml-2">Inicio de sesión exitoso! Redireccionando...</AlertDescription>
            </Alert>
          )}

          {errors.general && (
            <Alert className="bg-destructive/10 border-destructive text-destructive-foreground" role="alert">
              <AlertCircle className="h-5 w-5" aria-hidden="true" />
              <AlertDescription className="ml-2">{errors.general}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username" className="text-base font-medium text-neutral-600">
              Usuario
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              aria-required="true"
              aria-invalid={errors.username ? "true" : "false"}
              aria-describedby={errors.username ? "username-error" : undefined}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-12 rounded-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
              placeholder="usuario"
            />
            {errors.username && (
              <p id="username-error" className="text-sm text-destructive flex items-center gap-2 mt-2" role="alert">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {errors.username}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-base font-medium text-neutral-600">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                aria-required="true"
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error password-requirements" : "password-requirements"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 rounded-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Ingrese su contraseña."
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-10 w-10 text-muted-foreground hover:text-card-foreground hover:bg-muted cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </Button>
            </div>
            <p id="password-requirements" className="text-sm text-muted-foreground mt-1">
              Debe contener al menos 8 caracteres.
            </p>
            {errors.password && (
              <p id="password-error" className="text-sm text-destructive flex items-center gap-2 mt-2" role="alert">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <a
              href="#forgot-password"
              className="text-sm font-medium text-accent hover:text-accent-foreground hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card rounded-sm px-1 pb-2"
            >
              Recuperar Contraseña
            </a>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full h-12 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <span className="sr-only">Iniciando sesión...</span>
                <span aria-hidden="true">Iniciando sesión...</span>
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </Button>

          {/* <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a
              href="#signup"
              className="font-medium text-accent hover:text-accent-foreground hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card rounded-sm px-1"
            >
              Sign up
            </a>
          </p> */}
        </CardFooter>
      </form>
    </Card>
  )
}







