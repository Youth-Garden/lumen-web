/**
 * Extracts initials from a full name or email address.
 * 
 * @param fullName The user's full name
 * @param email The user's email address
 * @param fallback A default fallback string if both are missing
 * @returns A 1-2 character string representing the initials
 */
export const getUserInitials = (
  fullName?: string | null,
  email?: string | null,
  fallback: string = 'U',
): string => {
  if (fullName) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  }

  if (email) {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  }

  return fallback.toUpperCase();
};
