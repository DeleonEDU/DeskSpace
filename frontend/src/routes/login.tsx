import { createFileRoute, useNavigate, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { login as loginApi, fetchProfile } from "@/api/auth";
import { LoadingScreen } from "@/components/LoadingScreen";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2 } from "lucide-react";
import { labelCaps, inputField } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) return <LoadingScreen />;
  if (user) return <Navigate to="/" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const data = await loginApi(email, password);
      const userData = await fetchProfile(data.access);
      login(data.access, data.refresh, userData);
      navigate({ to: "/" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Невірний email або пароль");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="З поверненням"
      subtitle="Увійдіть до DeskSpace"
      footer={
        <>
          Немає акаунту?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Створити
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-center text-sm font-medium text-destructive">
            {error}
          </p>
        )}
        <div className="space-y-2">
          <Label htmlFor="email" className={labelCaps}>
            Email
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={cn(inputField, "pl-10")}
              placeholder="name@example.com"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className={labelCaps}>
            Пароль
          </Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={cn(inputField, "pl-10 font-mono")}
              placeholder="••••••••"
            />
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting} className="btn-primary h-12 w-full rounded-xl">
          {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : "Увійти"}
        </Button>
      </form>
    </AuthCard>
  );
}
