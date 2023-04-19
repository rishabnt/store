import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { StoreService } from 'src/app/services/store.service';

const ROWS_HEIGHT: {[id: number]: number} = {1: 400, 3:335, 4: 350 };

@Component({
  selector: 'app-home',
  templateUrl: `./home.component.html`
})
export class HomeComponent implements OnInit, OnDestroy {
  cols = 1;
  rowHeight= ROWS_HEIGHT[this.cols]; 
  category: string | undefined;
  products: Array<Product> | undefined;
  sort = 'Name: Descending';
  count = 12;
  productsSubscription: Subscription | undefined;

  constructor(
    private cartService: CartService, 
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productsSubscription = this.storeService.getAllProducts(this.count, this.sort, this.category)
      .subscribe(_products => {
        this.products = _products;
      })
  }

  onColumnsCountChange(colsNum: number): void {
    this.cols = colsNum;
    this.rowHeight=ROWS_HEIGHT[this.cols]
  }

  onItemsCountChange(newCount: number): void {
    this.count = newCount;
    this.getProducts()
  }

  onSortChange(newSort: string): void {
    this.sort = newSort === "Name: Ascending" ? 'asc' : 'desc';
    this.getProducts();
  }

  onShowCategory(newCategory: string): void {
    if(newCategory == '') 
      this.category = undefined;
    else
      this.category = newCategory;
    this.getProducts();
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      product: product.image,
      name: product.title, 
      price: product.price,
      quantity: 1,
      id: product.id,
    })
  }

  ngOnDestroy(): void {
    if(this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }

}
