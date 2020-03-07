import { Controller, Post, Get, Param, Put, Delete, Body } from '@nestjs/common';
import { CartService, Cart, Checkout } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('create')
  createCart(): Cart {
    return this.cartService.getNewCart();
  }

  @Put('add-product')
  addProduct(@Body() body): Cart {
    return this.cartService.addProduct(body.id, body.productId, body.quantity);
  }

  @Delete('remove-product')
  removeProduct(@Body() body): Cart {
    return this.cartService.removeProduct(body.id, body.productId);
  }

  @Get(':id')
  getCart(@Param() params): Cart {
    return this.cartService.getCart(params.id);
  }

  @Get('checkout/:id/:currency')
  checkoutCart(@Param() params): Checkout {
    return this.cartService.checkout(params.id, params.currency);
  }
}
