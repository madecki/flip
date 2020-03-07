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
    cart = controller.createCart()

    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create cart', () => {
    expect(cart).toHaveProperty('id');
    expect(cart).toHaveProperty('products');
  })

  it('should create products field that is an empty object', () => {
    expect(cart.products).toEqual({});
  })

  it('/GET cart', () => {
    return request(app.getHttpServer())
      .get(`/cart/${cart.id}`)
      .expect(200)
      .expect({
        id: cart.id,
        products: {}
      });
  });

  it('/PUT cart/add-product and returns cart', () => {
    return request(app.getHttpServer())
      .put(`/cart/add-product`)
      .send({id: cart.id, productId: 4, quantity: 3})
      .set('Accept', 'application/json')
      .expect(200)
      .expect({
        id: cart.id,
        products: {
          "4": {
            "name": "Product four",
            "desc": "Product desc",
            "price": 35,
            "currency": "CHF",
            "quantity": 3
          }
        }
      });
  });

  it('/PUT cart/add-product and removes product if qty === 0', () => {
    return request(app.getHttpServer())
      .put(`/cart/add-product`)
      .send({id: cart.id, productId: 4, quantity: 0})
      .set('Accept', 'application/json')
      .expect(200)
      .expect({
        id: cart.id,
        products: {}
      });
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
      });
  });

  it('/DELETE cart/remove-product', () => {
    return request(app.getHttpServer())
      .delete(`/cart/remove-product`)
      .send({id: cart.id, productId: 4 })
      .set('Accept', 'application/json')
      .expect(200)
      .expect({
        id: cart.id,
        products: {}
      });
  });
});
