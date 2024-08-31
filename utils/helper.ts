export function validatePassword(password: string) {
  password = password.trim();
  let hasLowerCase = false,
    hasUpperCase = false,
    hasDigit = false,
    hasSpecialCharacter = false,
    satisfyMinLength = false;

  satisfyMinLength = password.length > 4;

  for (const char of password) {
    if (/[a-z]/.test(char)) {
      hasLowerCase = true;
    }
    if (/[A-Z]/.test(char)) {
      hasUpperCase = true;
    }
    if (/[0-9]/.test(char)) {
      hasDigit = true;
    }
    if (["@", "$", "!", "%", "*", "?", "&", "/"].includes(char)) {
      hasSpecialCharacter = true;
    }
  }

  return (
    hasUpperCase &&
    hasLowerCase &&
    hasDigit &&
    hasSpecialCharacter &&
    satisfyMinLength
  );
}
