import { describe, it, expect } from 'vitest';
import { getUserInitials } from '../string';

describe('getUserInitials', () => {
  it('should return initials from full name with multiple words', () => {
    expect(getUserInitials('Nguyen Van An')).toBe('NA');
    expect(getUserInitials('John Doe')).toBe('JD');
  });

  it('should return first two letters for single word name', () => {
    expect(getUserInitials('Lumen')).toBe('LU');
  });

  it('should extract initials from email if full name is not provided', () => {
    expect(getUserInitials(null, 'alexander@example.com')).toBe('AL');
  });

  it('should return fallback if both fullName and email are missing or empty', () => {
    expect(getUserInitials(null, null, 'G')).toBe('G');
    expect(getUserInitials('', '', 'U')).toBe('U');
  });
});
