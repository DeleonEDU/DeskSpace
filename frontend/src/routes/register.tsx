import { createFileRoute, useNavigate, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, User, Phone } from "lucide-react";

export const Route = createFileRoute("/register")({
  component: Register,
});

function Register() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex size-16 items-center justify-center rounded-full bg-primary/10 shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" className="size-8 text-primary absolute">
              <path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2v-9z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
            <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          </div>
          <p className="animate-pulse font-display text-sm font-medium text-muted-foreground tracking-widest uppercase">
            Завантаження
          </p>
        </div>
      </div>
    );
  }
  if (user) return <Navigate to="/" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (password !== passwordConfirmation) {
      setError("Паролі не співпадають");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          first_name: firstName, 
          last_name: lastName, 
          phone_number: phone, 
          password, 
          password_confirmation: passwordConfirmation 
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(Object.values(data).flat().join(", ") || "Помилка реєстрації");
      }

      navigate({ to: "/login" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 py-10">
      <div className="w-full max-w-[480px] rounded-[2rem] bg-card/80 p-8 shadow-[var(--shadow-card)] ring-1 ring-border/60 backdrop-blur-xl sm:p-10">
        {/* Logo/Icon */}
        <div className="mx-auto mb-6 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" className="size-6">
            <path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2v-9z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">Створити акаунт</h1>
          <p className="mt-2 text-sm text-muted-foreground">Приєднуйтесь до DeskSpace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-xl bg-destructive/10 p-3 text-center text-sm font-medium text-destructive">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-xs uppercase tracking-wider text-muted-foreground">Ім'я</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="h-11 rounded-xl pl-10 bg-secondary/50 border-transparent focus:bg-background focus:border-primary focus:ring-primary/20 transition-all"
                  placeholder="Іван"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-xs uppercase tracking-wider text-muted-foreground">Прізвище</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="h-11 rounded-xl bg-secondary/50 border-transparent focus:bg-background focus:border-primary focus:ring-primary/20 transition-all"
                placeholder="Франко"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-xl pl-10 bg-secondary/50 border-transparent focus:bg-background focus:border-primary focus:ring-primary/20 transition-all"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs uppercase tracking-wider text-muted-foreground">Телефон</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="h-11 rounded-xl pl-10 bg-secondary/50 border-transparent focus:bg-background focus:border-primary focus:ring-primary/20 transition-all"
                placeholder="+380 50 123 4567"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">Пароль</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 rounded-xl pl-10 bg-secondary/50 border-transparent focus:bg-background focus:border-primary focus:ring-primary/20 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordConfirmation" className="text-xs uppercase tracking-wider text-muted-foreground">Підтвердження</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="passwordConfirmation"
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  className="h-11 rounded-xl pl-10 bg-secondary/50 border-transparent focus:bg-background focus:border-primary focus:ring-primary/20 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="h-11 w-full rounded-xl mt-2 font-medium shadow-sm transition-all active:scale-[0.98]">
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Створити акаунт"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Вже є акаунт?{" "}
          <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
            Увійти
          </Link>
        </div>
      </div>
    </div>
  );
}
