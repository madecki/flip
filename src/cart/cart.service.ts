import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { v1 as uuidv1 } from 'uuid';
import axios from 'axios';
import * as products from './products.json';

export class Checkout {
  products: any;
  total: number;
  currency: string;

  constructor(products: any, total: number, currency: string) {
    this.products = products;
    this.total = total;
    this.currency = currency;
  }
}

export class Cart {
  id: string;
  products: object;

  constructor() {
    this.id = uuidv1();
    // To make assembling faster and lighter
    this.products = {};
  }
}

@Injectable()
export class CartService {
  carts: object;

  constructor() {
    this.carts = {};
  }

  getNewCart() {
    const newCart = new Cart();
    this.carts[newCart.id] = newCart;
    return newCart;
  }

  getCart(id: string) {
    if (!this.carts.hasOwnProperty(id)) {
      throw new HttpException('Invalid cart id!', HttpStatus.NOT_FOUND); 
    }

    return this.carts[id];
  }

  addProduct(cartId: string, productId: string, quantity: number) {
    if (!products.hasOwnProperty(productId)) {
      throw new HttpException('Invalid product ID', HttpStatus.NOT_FOUND); 
    }

    if (!this.carts.hasOwnProperty(cartId)) {
      throw new HttpException('Invalid cart id!', HttpStatus.NOT_FOUND); 
    }

    if (quantity === 0) {
      this.removeProduct(cartId, productId);
      return this.carts[cartId];
    }

    if (this.carts[cartId].products.hasOwnProperty(productId)) {
      this.carts[cartId].products[productId].quantity = quantity;
    } else {
      const product = products[productId];
      product.quantity = quantity;
      this.carts[cartId].products[productId] = product;
    }

    return this.carts[cartId];
  }

  removeProduct(cartId: string, productId: string) {
    if (!this.carts.hasOwnProperty(cartId)) {
      throw new HttpException('Invalid cart id!', HttpStatus.NOT_FOUND); 
    }

    delete this.carts[cartId].products[productId]

    return this.carts[cartId];
  }

  checkout(cartId: string, currency: string) {
    if (!this.carts.hasOwnProperty(cartId)) {
      throw new HttpException('Invalid cart id!', HttpStatus.NOT_FOUND); 
    }

    let total = 0;
    const products = [];

    Object.keys(this.carts[cartId].products).forEach((prodId: any) => {
      const prod = this.carts[cartId].products[prodId];

      // To get each time valid, fresh currencies - in case of differences that would lead into money loss
      // just PoV

      axios.get('https://api.exchangeratesapi.io/latest').then(
        (data: any) => {
          const currencies = data.data.rates;

          const price = prod.price / currencies[prod.currency] * currencies[currency];
          products.push(
            {
              name: prod.name,
              desc: prod.desc,
              quantity: prod.quantity,
              price
            }
          )
        }
      );
    })

    for (const prod of products) {
      total =+ prod.price * prod.quantity;
    }

    return new Checkout(products, total, currency);
  }
}
