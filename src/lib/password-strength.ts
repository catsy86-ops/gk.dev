export interface PasswordStrengthResult {
  score: number; // 0 (bardzo słabe) do 4 (pancerne)
  labelPl: string;
  labelEn: string;
  colorClass: string;
  barColor: string;
  hasMinLength: boolean;
  hasNumber: boolean;
  hasUppercase: boolean;
  hasSpecialChar: boolean;
}

/**
 * Oblicza siłę hasła na podstawie standardowych reguł bezpieczeństwa OWASP
 */
export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return {
      score: 0,
      labelPl: "Wpisz hasło",
      labelEn: "Enter password",
      colorClass: "text-muted-foreground",
      barColor: "bg-muted",
      hasMinLength: false,
      hasNumber: false,
      hasUppercase: false,
      hasSpecialChar: false,
    };
  }

  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/]/.test(password);

  let score = 0;
  if (hasMinLength) score += 1;
  if (hasNumber) score += 1;
  if (hasUppercase) score += 1;
  if (hasSpecialChar) score += 1;

  if (password.length >= 12 && score >= 3) {
    score = 4;
  }

  switch (score) {
    case 1:
      return {
        score: 1,
        labelPl: "Słabe",
        labelEn: "Weak",
        colorClass: "text-rose-500",
        barColor: "bg-rose-500",
        hasMinLength,
        hasNumber,
        hasUppercase,
        hasSpecialChar,
      };
    case 2:
      return {
        score: 2,
        labelPl: "Średnie",
        labelEn: "Fair",
        colorClass: "text-amber-500",
        barColor: "bg-amber-500",
        hasMinLength,
        hasNumber,
        hasUppercase,
        hasSpecialChar,
      };
    case 3:
      return {
        score: 3,
        labelPl: "Dobre",
        labelEn: "Good",
        colorClass: "text-blue-500",
        barColor: "bg-blue-500",
        hasMinLength,
        hasNumber,
        hasUppercase,
        hasSpecialChar,
      };
    case 4:
      return {
        score: 4,
        labelPl: "Pancerne",
        labelEn: "Strong",
        colorClass: "text-emerald-500",
        barColor: "bg-emerald-500",
        hasMinLength,
        hasNumber,
        hasUppercase,
        hasSpecialChar,
      };
    default:
      return {
        score: 0,
        labelPl: "Bardzo słabe",
        labelEn: "Very Weak",
        colorClass: "text-rose-600",
        barColor: "bg-rose-600",
        hasMinLength,
        hasNumber,
        hasUppercase,
        hasSpecialChar,
      };
  }
}
