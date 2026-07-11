import Cookies from 'js-cookie';

export const cookieHelper = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null;
    return Cookies.get(key) || null;
  },
  
  set: (key: string, value: string, options?: Cookies.CookieAttributes) => {
    if (typeof window === 'undefined') return;
    Cookies.set(key, value, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      ...options,
    });
  },
  
  remove: (key: string, options?: Cookies.CookieAttributes) => {
    if (typeof window === 'undefined') return;
    Cookies.remove(key, options);
  },
};
