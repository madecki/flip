import { Controller, Post, Get, Param } from '@nestjs/common';
import { CartService, Cart } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/create')
  createCart(): Cart {
    return this.cartService.getNewCart();
  }

  @Get(':id')
  getCart(@Param() params): Cart {
    return this.cartService.getCart(params.id);
  }
}
