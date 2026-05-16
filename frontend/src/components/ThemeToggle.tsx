import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="size-9 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground"
      title={theme === "dark" ? "Світла тема" : "Темна тема"}
      aria-label={theme === "dark" ? "Увімкнути світлу тему" : "Увімкнути темну тему"}
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
