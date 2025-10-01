import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

// States
import { AuthState } from './states/auth/auth.state';
import { ProductsState } from './states/products/products.state';
import { RegionsState } from './states/regions/regions.state';

// Services
import { MedusaApiService } from './services/medusa-api.service';

// Configuration
import { MedusaStoreConfig } from './medusa-store.config';

@NgModule({
  imports: [
    NgxsModule.forFeature([
      AuthState,
      ProductsState,
      RegionsState,
    ]),
  ],
})
export class MedusaStoreModule {
  static forRoot(config?: MedusaStoreConfig): ModuleWithProviders<MedusaStoreModule> {
    return {
      ngModule: MedusaStoreModule,
      providers: [
        {
          provide: 'MEDUSA_STORE_CONFIG',
          useValue: config || {}
        },
        // Note: MedusaApiService should be provided by the consuming application
        // as it needs to implement the actual HTTP calls
      ]
    };
  }

  static forChild(): ModuleWithProviders<MedusaStoreModule> {
    return {
      ngModule: MedusaStoreModule,
      providers: []
    };
  }
}
