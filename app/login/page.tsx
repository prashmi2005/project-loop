"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Workflow, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword("password123");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500">
          <Workflow className="h-6 w-6 text-slate-950" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-white">LOOP</span>
      </div>

      <Card className="w-full max-w-md border-slate-800 bg-slate-900 text-slate-100">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-white">Welcome back</CardTitle>
          <CardDescription className="text-center text-slate-400">
            Sign in to access your feedback intelligence workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-rose-500/10 p-3 text-sm text-rose-400 border border-rose-500/20">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-slate-800 bg-slate-950 text-white placeholder-slate-500 focus-visible:ring-sky-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-slate-800 bg-slate-950 text-white focus-visible:ring-sky-500"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 text-slate-950 hover:bg-sky-400"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t border-slate-800 pt-6">
          <div className="w-full">
            <p className="text-xs text-center text-slate-500 mb-2">Quick Access Demo Roles</p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickLogin("admin@democorp.com")}
                className="border-slate-800 bg-slate-950 hover:bg-slate-800 hover:text-white text-xs py-1 h-auto"
              >
                Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickLogin("analyst@democorp.com")}
                className="border-slate-800 bg-slate-950 hover:bg-slate-800 hover:text-white text-xs py-1 h-auto"
              >
                Analyst
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickLogin("viewer@democorp.com")}
                className="border-slate-800 bg-slate-950 hover:bg-slate-800 hover:text-white text-xs py-1 h-auto"
              >
                Viewer
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
