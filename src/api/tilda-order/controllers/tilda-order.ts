/**
 * tilda-order controller
 */

import { Strapi, factories } from '@strapi/strapi'

export default factories.createCoreController('api::tilda-order.tilda-order', ({strapi}: {strapi: Strapi}) => ({
  byOrderId: async (ctx) => {
    const orderId = ctx.params.orderId;
    return strapi.service('api::tilda-order.tilda-order').getByOrderId(orderId);
  }
}));
