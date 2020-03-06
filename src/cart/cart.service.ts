import { Injectable } from '@nestjs/common';
import { v1 as uuidv1 } from 'uuid';

class Product {
  id: uuidv1;
  price: number;
  name: string;
  desc: string;

  constructor(id: uuidv1, price: number, name: string, desc: string) {
    this.id = id;
    this.price = price;
    this.name = name;
    this.desc = desc;
  }
}

export class Cart {
  id: string;
  products: Product[]

  constructor() {
    this.id = uuidv1();
    this.products = [];
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
    return this.carts[id];
  }
}
