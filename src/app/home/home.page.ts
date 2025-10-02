import { Component, OnInit, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSplitPane, IonMenu, IonList, IonItem, IonIcon, IonLabel, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonImg, IonFooter, IonButton, IonSpinner, IonText, IonButtons, IonMenuButton, IonBadge, IonItemDivider } from '@ionic/angular/standalone';
import { MedusaCurrency } from '../shared/pipes/medusa-currency/medusa-currency.pipe';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MedusaProduct } from '../shared/interfaces/customer-product.interface';
import { MedusaCategory, ProductsState, ProductsActions, RegionsState, MedusaCartActions } from 'projects/medusa-store/src/public-api';
// Using MedusaCurrency pipe for price formatting

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonSplitPane,
    IonMenu, IonList, IonItem, IonIcon, IonLabel, IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonImg, IonFooter,
    IonButton, IonSpinner, IonText, IonButtons, IonMenuButton, IonBadge,
    IonItemDivider, AsyncPipe, MedusaCurrency
  ],
})
export class HomePage implements OnInit {
  private store = inject(Store);

  products$: Observable<MedusaProduct[]> = this.store.select(ProductsState.getProductList);
  categories$: Observable<MedusaCategory[]> = this.store.select(ProductsState.getProductsCategories);
  selectedCategory$: Observable<MedusaProduct[]> = this.store.select(ProductsState.getSelectgedCategory);
  defaultRegion$ = this.store.select(RegionsState.getDefaultRegion);

  selectedCategoryId: string | null = null;
  isLoading = false;

  // Mock cart data - replace with actual cart observable when available
  private cartItems: any[] = [];
  private selectedCategoryName = '';

  ngOnInit() {
    // Load products and categories on init
    this.loadProducts();
    this.loadCategories();
  }

  private loadProducts() {
    this.isLoading = true;
    this.store.dispatch(new ProductsActions.GetProductsId()).subscribe({
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private loadCategories() {
    this.store.dispatch(new ProductsActions.GetCategories());
  }

  onCategorySelect(categoryId: string | null) {
    this.selectedCategoryId = categoryId;
    if (categoryId) {
      // Store the category name for display
      const categories = this.store.selectSnapshot(ProductsState.getProductsCategories);
      const category = categories?.find(cat => cat.id === categoryId);
      this.selectedCategoryName = category?.name || '';

      this.store.dispatch(new ProductsActions.GetCategory(categoryId));
    } else {
      this.selectedCategoryName = '';
    }
  }

  onProductClick(product: MedusaProduct) {
    const region = this.store.selectSnapshot(RegionsState.getDefaultRegion);
    if (region?.region_id) {
      this.store.dispatch(new ProductsActions.addSelectedProduct(product, region.region_id));
    }
  }

  addToCart(product: MedusaProduct, event: Event) {
    event.stopPropagation(); // Prevent product click

    if (product.variants && product.variants.length > 0) {
      const variant = product.variants[0]; // Use first variant for now

      // Add to mock cart for UI feedback
      if (!this.isProductInCart(product)) {
        this.cartItems.push({ productId: product.id, variant });
      }

      this.store.dispatch(new MedusaCartActions.AddToMedusaCart(variant));
    }
  }

  getProductPrice(product: MedusaProduct): { amount: number; currency?: string } | null {
    if (product.variants && product.variants.length > 0) {
      const variant = product.variants[0];

      // Try calculated_price first (this is the price with region/currency applied)
      if (variant.calculated_price?.calculated_amount !== undefined && variant.calculated_price?.calculated_amount !== null) {
        return { amount: variant.calculated_price.calculated_amount };
      }

      // Fallback to prices array
      if (variant.prices && variant.prices.length > 0) {
        const price = variant.prices[0];
        return { amount: price.amount, currency: price.currency_code };
      }
    }
    return null;
  }

  // TODO: Remove these methods - now using MedusaCurrency pipe
  private formatMedusaPrice(amount: number, currencyCode: string = 'USD'): string {
    try {
      // Medusa stores prices in smallest currency unit (cents)
      // So 1000 = $10.00, 2500 = $25.00, etc.
      const actualPrice = amount / 100;

      // Get the current region's currency if available
      const region = this.store.selectSnapshot(RegionsState.getDefaultRegion);
      const currency = region?.currency_code || currencyCode || 'USD';

      // Format based on currency with appropriate locale
      const locale = this.getCurrencyLocale(currency);
      const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      return formatter.format(actualPrice);
    } catch (error) {
      console.warn('Error formatting price:', error);
      // Fallback to simple format
      return `$${(amount / 100).toFixed(2)}`;
    }
  }

  private getCurrencyLocale(currency: string): string {
    // Map currencies to appropriate locales for better formatting
    const currencyLocaleMap: { [key: string]: string } = {
      'USD': 'en-US',
      'EUR': 'de-DE',
      'GBP': 'en-GB',
      'JPY': 'ja-JP',
      'CAD': 'en-CA',
      'AUD': 'en-AU',
      'BRL': 'pt-BR',
      'INR': 'en-IN'
    };

    return currencyLocaleMap[currency.toUpperCase()] || 'en-US';
  }

  getProductImage(product: MedusaProduct): string {
    if (product.thumbnail) {
      return product.thumbnail;
    }
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    return 'https://placehold.co/600x400';
  }

  getDisplayProducts(): Observable<MedusaProduct[]> {
    return this.selectedCategoryId ? this.selectedCategory$ : this.products$;
  }

  trackByProductId(index: number, product: MedusaProduct): string {
    return product.id;
  }

  trackByCategoryId(index: number, category: MedusaCategory): string {
    return category.id;
  }

  getSelectedCategoryName(): string {
    if (!this.selectedCategoryId) return 'All Products';

    const categories = this.store.selectSnapshot(ProductsState.getProductsCategories);
    const category = categories?.find(cat => cat.id === this.selectedCategoryId);
    return category?.name || 'Category';
  }

  isProductInCart(product: MedusaProduct): boolean {
    // Mock implementation - replace with actual cart logic
    return this.cartItems.some(item => item.productId === product.id);
  }

  hasAvailableVariants(product: MedusaProduct): boolean {
    return product.variants && product.variants.length > 0;
  }

  getCartItemCount(): number {
    // Mock implementation - replace with actual cart count
    return this.cartItems.length;
  }

  viewCart(): void {
    // Navigate to cart page
    console.log('Navigate to cart');
    // this.router.navigate(['/cart']);
  }
}
