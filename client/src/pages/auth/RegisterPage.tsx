import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { register, isRegistering } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ username, password });
      setLocation("/");
    } catch (err) {
      // Error handled by hook toast
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 bg-secondary/30 flex flex-col justify-center items-center p-4 py-12">
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
            <h1 className="text-3xl font-display font-bold mb-2">Create Account</h1>
            <p className="text-muted-foreground">Join us to start shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Choose a Username</Label>
              <Input 
                id="username" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-background h-12 px-4 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Create Password</Label>
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
              disabled={isRegistering}
              className="w-full h-12 text-base rounded-xl shadow-lg shadow-primary/20 transition-all"
            >
              {isRegistering ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
