import { createFileRoute, useNavigate, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { registerUser } from "@/api/auth";
import { LoadingScreen } from "@/components/LoadingScreen";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Circle, Mail, Lock, Loader2, User, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { labelCaps, inputField } from "@/lib/ui-classes";
import { formatPhoneInput, phoneToE164 } from "@/lib/phone";

export const Route = createFileRoute("/register")({
  component: Register,
});

const passwordReqsDef = (password: string) => [
  { label: "Мінімум 8 символів", met: password.length >= 8 },
  { label: "Велика літера", met: /[A-ZА-ЯІЄЇҐ]/.test(password) },
  { label: "Маленька літера", met: /[a-zа-яієїґ]/.test(password) },
  { label: "Цифра", met: /[0-9]/.test(password) },
];

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

  const passwordReqs = passwordReqsDef(password);

  if (isLoading) return <LoadingScreen />;
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
    if (!passwordReqs.every((r) => r.met)) {
      setError("Пароль не відповідає вимогам безпеки");
      setIsSubmitting(false);
      return;
    }
    const plainPhone = phoneToE164(phone);
    if (plainPhone.length !== 13) {
      setError("Введіть коректний номер телефону (10 цифр після +38)");
      setIsSubmitting(false);
      return;
    }

    try {
      await registerUser({
        email,
        first_name: firstName,
        last_name: lastName,
        phone_number: plainPhone,
        password,
        password_confirmation: passwordConfirmation,
      });
      navigate({ to: "/login" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Помилка реєстрації");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Створити акаунт"
      subtitle="Приєднуйтесь до DeskSpace"
      footer={
        <>
          Вже є акаунт?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Увійти
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-center text-sm font-medium text-destructive">
            {error}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="firstName" className={labelCaps}>
              Ім&apos;я
            </Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className={cn(inputField, "pl-10")}
                placeholder="Іван"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className={labelCaps}>
              Прізвище
            </Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className={inputField}
              placeholder="Франко"
            />
          </div>
        </div>

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
          <Label htmlFor="phone" className={labelCaps}>
            Телефон
          </Label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
              required
              className={cn(inputField, "pl-10 tracking-wide")}
              placeholder="+38 (050) 123-45-67"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
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
          <div className="space-y-2">
            <Label htmlFor="passwordConfirmation" className={labelCaps}>
              Підтвердження
            </Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="passwordConfirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                className={cn(inputField, "pl-10 font-mono")}
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        {password.length > 0 && (
          <ul className="grid grid-cols-2 gap-2 rounded-xl border border-border/50 bg-secondary/30 p-3">
            {passwordReqs.map((req) => (
              <li key={req.label} className="flex items-center gap-2 text-xs">
                {req.met ? (
                  <CheckCircle2 className="size-3.5 shrink-0 text-primary" />
                ) : (
                  <Circle className="size-3.5 shrink-0 text-muted-foreground/40" />
                )}
                <span className={req.met ? "font-medium text-foreground" : "text-muted-foreground"}>
                  {req.label}
                </span>
              </li>
            ))}
          </ul>
        )}

        <Button type="submit" disabled={isSubmitting} className="btn-primary h-12 w-full rounded-xl">
          {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : "Створити акаунт"}
        </Button>
      </form>
    </AuthCard>
  );
}
