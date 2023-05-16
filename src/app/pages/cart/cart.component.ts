import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Subscription } from 'rxjs';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit, OnDestroy{
  cart: Cart = { items: [] };
  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [
    'product', 
    'name', 
    'price',
    'quantity',
    'total', 
    'action'
  ]
  cartSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    })
  }

  constructor(private cartService: CartService, private http: HttpClient) {}

  getTotal(items: Array<CartItem>) : number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  onChangeQuantity(item: CartItem, quantity: number): void {
    this.cartService.changeQuantity(item, quantity);
  }

  onCheckout(): void {
    this.http
      .post('http://localhost:4242/checkout', {
        items: this.cart.items,
      })
      .subscribe( async (res: any) => {
        console.log('Client')
        let stripe = await loadStripe('pk_test_51MnNkpSD2QjAlbAeCLTCSDUb90XR3ar8W67y1tea0hNd4dgq3nwYwNAMlyCseYB3RejaE00TFzFydILG2Cvyv9JT00I9EwIBTM');

        stripe?.redirectToCheckout({
          sessionId: res.id
        })
      })
  }

  ngOnDestroy(): void {
    if(this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

}
