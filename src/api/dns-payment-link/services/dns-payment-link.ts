/**
 * dns-payment-link service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::dns-payment-link.dns-payment-link', ({ strapi }) => ({
  save: async (data) => {
    const existingPaymentLink = await strapi
    .db
    .query('api::dns-payment-link.dns-payment-link')
    .findOne({
      where: {
        paynet_order_id: data.paynet_order_id,
        serial_number: data.serial_number,
        merchant_order_id: data.merchant_order_id
      }});

    if (!existingPaymentLink?.id) {
      return strapi.service('api::dns-payment-link.dns-payment-link').create({ data });
    }

    return existingPaymentLink;
  },
  getByPaynetOrderId: async (paynet_order_id: string) => {
    return strapi.db.query('api::dns-payment-link.dns-payment-link').findOne({where: {paynet_order_id}});
  },
}));
