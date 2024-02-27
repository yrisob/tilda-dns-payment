/**
 * dns-payment service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::dns-payment.dns-payment',  ({ strapi }) => ({
  save: async (data,dns_payment_link ) => {
    const { ["serial-number"]:serial_number,
    merchant_order,
    client_orderid,
    orderid,
    status,
    amount,
    currency,
    error_message,
    control,
    email} = data;

    return strapi.db.query('api::dns-payment.dns-payment').create({data: {
      serial_number,
      merchant_order,
      client_orderid,
      orderid,
      status,
      amount,
      currency,
      error_message,
      control,
      email,
      data,
      dns_payment_link
    }});
  }
}));
