/**
 * dns-payment controller
 */

import { Strapi, factories } from '@strapi/strapi'
import { Context } from 'koa'

export default factories.createCoreController('api::dns-payment.dns-payment', ({strapi}:{strapi: Strapi}) => ({
  getByClientOrderId: async (ctx: Context) => {
    const { clientOrderId } = ctx.params

    return strapi.service('api::dns-payment.dns-payment').getByClientOrderId(clientOrderId);
  }
}));
