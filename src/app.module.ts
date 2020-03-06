import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartController } from './cart/cart.controller';
import { CartService } from './cart/cart.service';

@Module({
  imports: [],
  controllers: [AppController, CartController],
  providers: [AppService, CartService],
})
export class AppModule {}
