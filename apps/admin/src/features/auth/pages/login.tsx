import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Input, Label, Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@lumen/uikit/components"
import { useLogin } from "../hooks"
import { useAuthStore } from "@/store/auth.store"
import { Icons } from '@lumen/uikit/icons';
import { toast } from "sonner"

export default function Login() {
  const navigate = useNavigate()
  const setToken = useAuthStore((state) => state.setToken)
  const loginMutation = useLogin()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error("Please enter email and password")
      return
    }

    loginMutation.mutate({ email, password }, {
      onSuccess: (response) => {
        if (response.data?.accessToken) {
          setToken(response.data.accessToken)
          toast.success("Welcome back to Lumen Admin!")
          navigate("/dashboard")
        }
      },
      onError: () => {
        toast.error("Invalid credentials. Please try again.")
      }
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Icons name="shield-check" className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Lumen Admin</h1>
        <p className="text-muted-foreground mt-2">Sign in to access the control panel</p>
      </div>

      <Card className="w-full max-w-md shadow-xl border-0 ring-1 ring-slate-200 dark:ring-slate-800">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-semibold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Icons name="mail" className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@lumen.com"
                  className="pl-10 h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loginMutation.isPending}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Icons name="lock" className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loginMutation.isPending}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2 pb-6">
            <Button 
              className="w-full h-11 text-base font-medium shadow-md transition-all" 
              type="submit"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Icons name="loader-2" className="mr-2 h-5 w-5 animate-spin" /> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <p className="mt-8 text-sm text-muted-foreground text-center">
        Protected area. Authorized personnel only.
      </p>
    </div>
  )
}
