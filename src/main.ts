import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { NgxStripeModule } from 'ngx-stripe';
import { SharedModule } from './app/shared';
import { NgxsStoreModule } from './app/store/store.module';
import { MedusaStoreModule, MedusaApiService } from 'projects/medusa-store/src/public-api';
import { ConcreteMedusaService } from './app/shared/api/concrete-medusa.service';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { IMAGE_CONFIG } from '@angular/common';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { ErrorInterceptor } from './app/shared/errors/errors.interceptor';
import { MedusaInterceptor } from './app/shared/interceptor/medusa.interceptor';
import { AuthInterceptor } from './app/shared/interceptor/auth.interceptor';
import { register } from 'swiper/element/bundle';

register();

bootstrapApplication(AppComponent, {
  providers: [
    {
      // https://angular.io/guide/image-directive
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
        disableImageLazyLoadWarning: true
      }
    },
    { provide: HTTP_INTERCEPTORS, useClass: MedusaInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: MedusaApiService, useClass: ConcreteMedusaService },
    provideIonicAngular({
      // mode: "md"
      _forceStatusbarPadding: true,
      swipeBackEnabled: true,
      animated: true,
    }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(
      withInterceptorsFromDi(),
    ),
    provideAnimationsAsync(),
    ModalController,
    importProvidersFrom(
      NgxsStoreModule,
      MedusaStoreModule.forRoot({
        apiBaseUrl: process.env.MEDUSA_BACKEND_URL,
        publishableKey: process.env.MEDUSA_PUBLISHABLE_KEY,
        enableLogging: true,
        enableStorage: true
      }),
      SharedModule,
      NgxStripeModule.forRoot(process.env.STRIPE_PUBLISHABLE_KEY),
    ),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
      }),
      fallbackLang: 'en',
    }),
    provideAnimationsAsync(),
  ],
});
