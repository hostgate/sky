import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { OrderService } from '../order/order.service';
@Injectable()
export class OrdersReportsResolverService {

  constructor(  private orderService:OrderService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.orderService.getOrders();
  }

}






