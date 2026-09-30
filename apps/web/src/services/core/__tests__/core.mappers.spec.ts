import { describe, it, expect } from 'vitest';
import {
  toI18nString,
  idResponseMapper,
  voidResponseMapper,
  pagingMapper,
} from '../core.mappers';

describe('core.mappers', () => {
  describe('toI18nString', () => {
    it('should return empty object for null or undefined values', () => {
      expect(toI18nString(null)).toEqual({});
      expect(toI18nString(undefined)).toEqual({});
    });

    it('should convert string to I18nString object', () => {
      expect(toI18nString('test')).toEqual({ en: 'test' });
      expect(toI18nString('{"en":"Hello","vi":"Xin chào"}')).toEqual({
        en: 'Hello',
        vi: 'Xin chào',
      });
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

  describe('pagingMapper', () => {
    it('should map items and pagination metadata correctly', () => {
      const raw = {
        items: [{ id: '1' }, { id: '2' }],
        meta: {
          currentPage: 1,
          perPage: 10,
          totalItems: 2,
          totalPages: 1,
        },
      };
      const result = pagingMapper(raw, (item: { id: string }) => item.id);
      expect(result).toEqual({
        items: ['1', '2'],
        meta: {
          currentPage: 1,
          perPage: 10,
          totalItems: 2,
          totalPages: 1,
        },
      });
    });

    it('should return null when raw or meta is missing or invalid', () => {
      expect(pagingMapper(null, (x) => x)).toBeNull();
      expect(pagingMapper(undefined, (x) => x)).toBeNull();
      expect(pagingMapper({}, (x) => x)).toBeNull();
      expect(pagingMapper({ items: [] }, (x) => x)).toBeNull();
      expect(pagingMapper({ meta: {} }, (x) => x)).toBeNull();
    });

    it('should handle raw with data array and meta correctly', () => {
      const raw = {
        data: [{ id: '1' }],
        meta: {
          currentPage: 2,
          perPage: 15,
          totalItems: 30,
          totalPages: 2,
        },
      };
      const result = pagingMapper(raw, (item: { id: string }) => item.id);
      expect(result).toEqual({
        items: ['1'],
        meta: {
          currentPage: 2,
          perPage: 15,
          totalItems: 30,
          totalPages: 2,
        },
      });
    });
  });
});
