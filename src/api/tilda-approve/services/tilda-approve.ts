/**
 * tilda-approve service
 */

import { Strapi, factories } from '@strapi/strapi';

export default factories.createCoreService('api::tilda-approve.tilda-approve', ({ strapi }: { strapi: Strapi }) => ({
  saveWithDnsPayment: async (data) => {
    const { name, email, phone, formid, formname, payment } = data;

    const dnsPayment = await strapi.service('api::dns-payment.dns-payment').getByOrderId(payment.systranid);

    return strapi.db.query('api::tilda-approve.tilda-approve').create({
      data: {
        name,
        email,
        phone,
        formid,
        formname,
        data,
        dns_payment: { id: dnsPayment?.id },
      },
    });
  },
}));
