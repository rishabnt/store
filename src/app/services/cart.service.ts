import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart = new BehaviorSubject<Cart>({items: []})

  constructor(private _snackBar: MatSnackBar) { }

  addToCart(item: CartItem): void {
    const items = [...this.cart.value.items];

    const itemInCart = items.find((_item) => _item.id === item.id);
    if(itemInCart) {
      itemInCart.quantity += 1;
    } else {
      items.push(item)
    }

    this.cart.next({ items })
    this._snackBar.open('1 item added to cart.', 'Ok', { duration: 3000 });
  }

  getTotal(items: Array<CartItem>) : number {
    return items
      .map(item => item.price * item.quantity)
      .reduce((prev, curr) => prev + curr, 0)
  }

  clearCart(): void {
    this.cart.next({items: []});
    this._snackBar.open('Cart is cleared.', 'Ok', {
      duration: 3000
    });
  }

  removeFromCart(item: CartItem, update: boolean = true): Array<CartItem> {
    const filteredItems = this.cart.value.items.filter(_item => _item.id != item.id);

    if(update) {
      this.cart.next({items: filteredItems});
      this._snackBar.open('1 item removed from the cart', 'Ok', {
        duration: 3000
    })}

    return filteredItems;
  }

  changeQuantity(item: CartItem, quantity: number): void {
    let deletedItem : CartItem | undefined;

    this.cart.value.items.map( _item => {
      if(_item.id === item.id) 
        if(_item.quantity == 1 && quantity === -1)
          deletedItem = _item;
        else 
          item.quantity += quantity;
    })
    let filteredItems = this.cart.value.items;

    if(deletedItem) {
      filteredItems = this.removeFromCart(deletedItem, false);
    }

    this.cart.next({items: filteredItems});
    this._snackBar.open('Item Quantity changed', 'Ok', {
      duration: 3000
    })


  }

}
