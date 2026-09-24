import { describe, it, expect } from 'vitest';
import {
  toI18nString,
  idResponseMapper,
  voidResponseMapper,
} from '../core.mappers';

describe('core.mappers', () => {
  describe('toI18nString', () => {
    it('should return empty object for null or non-object values', () => {
      expect(toI18nString(null)).toEqual({});
      expect(toI18nString(undefined)).toEqual({});
      expect(toI18nString('test')).toEqual({});
    });

    it('should return object as is when object is passed', () => {
      const obj = { en: 'Hello', vi: 'Xin chào' };
      expect(toI18nString(obj)).toEqual(obj);
    });
  });

  describe('idResponseMapper', () => {
    it('should map id correctly', () => {
      expect(idResponseMapper({ id: '123' })).toEqual({ id: '123' });
      expect(idResponseMapper({})).toEqual({ id: '' });
    });
  });

  describe('voidResponseMapper', () => {
    it('should return undefined', () => {
      expect(voidResponseMapper()).toBeUndefined();
    });
  });
});
