/**
 * Centralized Admin Configuration for IEEE SSIT SSN Student Branch
 * 
 * To add additional admins in the future:
 * Simply add the new student's official @ssn.edu.in email to the DEFAULT_ADMIN_EMAILS array below.
 * The system automatically enforces @ssn.edu.in domain validation and syncs with Firestore.
 */

export const DEFAULT_ADMIN_EMAILS: string[] = [
  "nathaniel2470009@ssn.edu.in",
  "sharruk2470048@ssn.edu.in",
  "shriram2410046@ssn.edu.in",
  "varun2410158@ssn.edu.in",
  "harshika2410326@ssn.edu.in",
  "vedika2410432@ssn.edu.in",
  "harshini2410197@ssn.edu.in",
  "pranav2410328@ssn.edu.in",
]

export type UserRole = "admin" | "user" | "visitor"

export function normalizeEmail(email?: string | null): string {
  if (!email) return ""
  return email.toLowerCase().trim()
}

export function isOfficialSSNEmail(email?: string | null): boolean {
  const normalized = normalizeEmail(email)
  return Boolean(normalized && normalized.endsWith("@ssn.edu.in"))
}
