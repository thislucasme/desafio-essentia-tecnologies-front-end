import { HttpInterceptorFn } from '@angular/common/http';
import { API_URL } from '../config/api';
import { ACCESS_TOKEN_STORAGE_KEY } from '../constants/auth';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

  if (!token || !request.url.startsWith(API_URL)) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
