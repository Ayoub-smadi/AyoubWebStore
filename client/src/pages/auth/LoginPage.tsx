import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag, ArrowRight } from "lucide-react";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password });
      // Extract redirect from URL search params if any
      const searchParams = new URLSearchParams(window.location.search);
      setLocation(searchParams.get('redirect') || "/");
    } catch (err) {
      // Error handled by hook toast
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col justify-center items-center p-4">
      <Link href="/" className="flex items-center gap-2 group mb-8">
        <div className="bg-primary text-primary-foreground p-2 rounded-xl group-hover:scale-105 transition-transform">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <span className="font-display font-bold text-3xl tracking-tight text-foreground">
          Ayoub<span className="text-primary">.</span>
        </span>
      </Link>

      <div className="w-full max-w-md bg-card border border-border/50 rounded-[2rem] p-8 shadow-xl shadow-black/5 animate-in slide-in-from-bottom-8 duration-500">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-background h-12 px-4 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background h-12 px-4 rounded-xl"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoggingIn}
            className="w-full h-12 text-base rounded-xl shadow-lg shadow-primary/20 transition-all"
          >
            {isLoggingIn ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Create one
          </Link>
        </div>
      </div>
      
      {/* Admin hint */}
      <div className="mt-8 text-xs text-muted-foreground/60 text-center max-w-sm">
        Admin login: Username <code className="bg-background px-1 py-0.5 rounded">Ayoub</code> / Password <code className="bg-background px-1 py-0.5 rounded">password</code>
      </div>
    </div>
  );
}
