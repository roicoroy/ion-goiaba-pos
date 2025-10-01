# @your-org/medusa-store

A comprehensive NGXS state management library for Medusa e-commerce applications built with Angular.

## Features

- 🛒 **Complete Cart Management** - Add, remove, update cart items with region-aware pricing
- 🔐 **Authentication State** - Login, registration, session management, and customer data
- 📦 **Product Catalog** - Products, categories, variants, and pricing management
- 🌍 **Multi-Region Support** - Region selection, currency handling, and localized pricing
- 🎯 **Type-Safe** - Full TypeScript support with comprehensive interfaces
- 🔄 **Reactive** - Built on RxJS observables for reactive state management
- 🏗️ **Modular** - Use only the states you need in your application

## Installation

```bash
npm install @your-org/medusa-store @ngxs/store @ngxs/logger-plugin @ngxs/storage-plugin
```

## Quick Start

### 1. Implement the API Service

First, create a service that implements the `MedusaApiService` abstract class:

```typescript
// your-medusa-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedusaApiService } from '@your-org/medusa-store';

@Injectable({
  providedIn: 'root'
})
export class YourMedusaApiService extends MedusaApiService {
  constructor(private http: HttpClient) {
    super();
  }

  // Implement all abstract methods
  loginEmailPassword(email: string, password?: string): Observable<any> {
    return this.http.post('/auth/customer/emailpass', { email, password });
  }

  // ... implement other methods
}
```

### 2. Configure Your App Module

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { MedusaStoreModule, MedusaApiService } from '@your-org/medusa-store';
import { YourMedusaApiService } from './your-medusa-api.service';

@NgModule({
  imports: [
    NgxsModule.forRoot([]),
    MedusaStoreModule.forRoot({
      apiBaseUrl: 'https://your-medusa-api.com',
      publishableKey: 'your-publishable-key',
      defaultCountryCode: 'us',
      enableLogging: true,
      enableStorage: true,
    })
  ],
  providers: [
    {
      provide: MedusaApiService,
      useClass: YourMedusaApiService
    }
  ]
})
export class AppModule {}
```

### 3. Use in Components

```typescript
// product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { 
  ProductsState, 
  ProductsActions, 
  MedusaProduct,
  MedusaCartActions 
} from '@your-org/medusa-store';

@Component({
  selector: 'app-product-list',
  template: `
    <div *ngFor="let product of products$ | async">
      <h3>{{ product.title }}</h3>
      <button (click)="addToCart(product)">Add to Cart</button>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products$: Observable<MedusaProduct[]>;

  constructor(private store: Store) {
    this.products$ = this.store.select(ProductsState.getProductList);
  }

  ngOnInit() {
    this.store.dispatch(new ProductsActions.GetProductsId());
  }

  addToCart(product: MedusaProduct) {
    if (product.variants?.[0]) {
      this.store.dispatch(new MedusaCartActions.AddToMedusaCart(product.variants[0]));
    }
  }
}
```

## Available States

### AuthState
- User authentication and session management
- Customer profile data
- Address management

### ProductsState  
- Product catalog with variants and pricing
- Category management
- Product search and filtering

### RegionsState
- Multi-region support
- Currency and country selection
- Localized pricing

### MedusaCartState
- Shopping cart management
- Line item operations
- Checkout flow support

## License

This project is licensed under the MIT License.
