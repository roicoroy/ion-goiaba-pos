import { Component, OnInit, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonSplitPane, IonMenu, IonList, IonItem, IonIcon, IonLabel, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonImg, IonFooter, IonButton, IonSpinner, IonText } from '@ionic/angular/standalone';
import { NgFor, NgIf, AsyncPipe, CurrencyPipe } from '@angular/common';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MedusaProduct } from '../shared/interfaces/customer-product.interface';
import { MedusaCategory } from '../shared/interfaces/medusa-categories.interface';
import { ProductsState } from '../store/products/products.state';
import { ProductsActions } from '../store/products/products.actions';
import { RegionsState } from '../store/regions/regions.state';
import { MedusaCartActions } from '../store/medusa-cart/medusa-cart.actions';
import { formatCurrency } from '../shared/utls';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonSplitPane,
    IonMenu, IonList, IonItem, IonIcon, IonLabel, IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonImg, IonFooter,
    IonButton, IonSpinner, IonText, NgFor, NgIf, AsyncPipe, CurrencyPipe
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
      this.store.dispatch(new ProductsActions.GetCategory(categoryId));
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
      this.store.dispatch(new MedusaCartActions.AddToMedusaCart(variant));
    }
  }

  getProductPrice(product: MedusaProduct): string {
    if (product.variants && product.variants.length > 0) {
      const variant = product.variants[0];
      if (variant.calculated_price) {
        return formatCurrency(variant.calculated_price);
      }
      if (variant.prices && variant.prices.length > 0) {
        return formatCurrency(variant.prices[0].amount);
      }
    }
    return 'Price not available';
  }

  getProductImage(product: MedusaProduct): string {
    if (product.thumbnail) {
      return product.thumbnail;
    }
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    return 'https://via.placeholder.com/300?text=No+Image';
  }

  getDisplayProducts(): Observable<MedusaProduct[]> {
    return this.selectedCategoryId ? this.selectedCategory$ : this.products$;
  }

  trackByProductId(index: number, product: MedusaProduct): string {
    return product.id;
  }
}
