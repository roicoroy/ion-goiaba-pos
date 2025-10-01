import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Store } from '@ngxs/store';
import { AuthState, AuthActions } from 'projects/medusa-store/src/public-api';
import { GlobalErrorHandlerService } from './global-error-handler/global-error-handler.service';
import { AlertService } from '../alert/alert.service';
import { NavigationService } from '../navigation/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {
  private store = inject(Store);
  private globalErrors = inject(GlobalErrorHandlerService);
  private alert = inject(AlertService);
  private nav = inject(NavigationService);

  // URLs that should not trigger automatic error handling
  private readonly skipErrorHandling = [
    '/auth/session',
    '/auth/token/refresh'
  ];

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Skip error handling for certain endpoints
        if (this.shouldSkipErrorHandling(request.url)) {
          return throwError(() => error);
        }

        this.handleHttpError(error);
        return throwError(() => error);
      })
    );
  }

  private shouldSkipErrorHandling(url: string): boolean {
    return this.skipErrorHandling.some(skipUrl => url.includes(skipUrl));
  }

  private handleHttpError(error: HttpErrorResponse): void {
    const isLoggedIn = this.store.selectSnapshot(AuthState.isLoggedIn);

    switch (error.status) {
      case 400:
        this.globalErrors.handleError(error);
        console.warn('Bad Request:', error.error?.message || 'Invalid request');
        break;

      case 401:
        this.globalErrors.handleError(error);
        if (isLoggedIn) {
          // User was logged in but token expired
          this.store.dispatch(new AuthActions.AuthLogout());
          this.nav.navigateTo('welcome');
        }
        break;

      case 403:
        this.globalErrors.handleError(error);
        console.warn('Forbidden:', error.error?.message || 'Access denied');
        break;

      case 404:
        this.globalErrors.handleError(error);
        console.warn('Not Found:', error.error?.message || 'Resource not found');
        break;

      case 422:
        this.globalErrors.handleError(error);
        console.warn('Validation Error:', error.error?.message || 'Invalid data');
        break;

      case 429:
        this.globalErrors.handleError(error);
        console.warn('Too Many Requests:', 'Please slow down your requests');
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        this.globalErrors.handleError(error);
        console.error('Server Error:', error.error?.message || 'Server is experiencing issues');
        break;

      default:
        this.globalErrors.handleError(error);
        console.error('Unknown Error:', error);
        break;
    }
  }
}
