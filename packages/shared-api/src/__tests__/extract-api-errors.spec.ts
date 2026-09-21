import { describe, it, expect } from 'vitest';
import { extractApiErrors } from '../base-api.service';
import type { BaseResponse } from '../types';

describe('extractApiErrors', () => {
  it('should return empty array when errorData is null or undefined', () => {
    expect(extractApiErrors(null)).toEqual([]);
    expect(extractApiErrors(undefined)).toEqual([]);
  });

  it('should extract messages from backend errors array of ErrorItem objects', () => {
    const errorData: Partial<BaseResponse<unknown>> = {
      code: 'BAD_REQUEST',
      message: 'Validation failed',
      errors: [
        { field: 'email', message: 'email must be an email' },
        { field: 'password', message: 'password is too short' },
      ],
    };

    const errors = extractApiErrors(errorData);
    expect(errors).toEqual([
      'email: email must be an email',
      'password: password is too short',
    ]);
  });

  it('should format ErrorItem without field as simple message', () => {
    const errorData: Partial<BaseResponse<unknown>> = {
      code: 'FORBIDDEN',
      message: 'Forbidden resource',
      errors: [{ message: 'User account is inactive' }],
    };

    const errors = extractApiErrors(errorData);
    expect(errors).toEqual(['User account is inactive']);
  });

  it('should fall back to top-level message when errors array is empty or omitted', () => {
    const errorData: Partial<BaseResponse<unknown>> = {
      code: 'NOT_FOUND',
      message: 'Entity not found',
    };

    const errors = extractApiErrors(errorData);
    expect(errors).toEqual(['Entity not found']);
  });
});
