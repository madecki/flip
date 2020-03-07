import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { INestApplication } from '@nestjs/common';

describe('Cart Controller', () => {
  let app: INestApplication;
  let controller: CartController;
  let cart;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [CartService]
    }).compile();

    controller = module.get<CartController>(CartController);
    cart = controller.createCart();

    app = module.createNestApplication();
    await app.init();
  });

  it('/PUT cart/add-product and returns cart with updated qty', () => {
    return request(app.getHttpServer())
      .put(`/cart/add-product`)
      .send({id: cart.id, productId: 4, quantity: 1})
      .set('Accept', 'application/json')
      .expect(200)
      .expect({
        id: cart.id,
        products: {
          "4": {
            name: "Product four",
            desc: "Product desc",
            price: 35,
            currency: "CHF",
            quantity: 1
          }
        }
      }).then(() => {
        return request(app.getHttpServer())
        .get(`/cart/checkout/${cart.id}/PLN`)
        .set('Accept', 'application/json')
        .expect(200)
        .expect({
          products: [],
          total: 0,
          currency: 'PLN'
        });
      });
  });
});
