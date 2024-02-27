import { Strapi, factories } from '@strapi/strapi';

export default factories.createCoreService('api::payer-address.payer-address', ({ strapi }: { strapi: Strapi }) => ({
  createPayerAddress: async (payerAddressData: any) => {
    const createdPayerAddress = await strapi
      .service('api::payer-address.payer-address')
      .create({ data: payerAddressData });

    return await strapi
      .query('api::payer-address.payer-address')
      .findOne({ where: { id: createdPayerAddress.id }, populate: { tilda_order: true } });
  },
}));
