/**
 * dns-setting service
 */

import { Strapi, factories } from '@strapi/strapi';
import { IDnsSettings } from '../types';


export default factories.createCoreService('api::dns-setting.dns-setting', ({strapi}: {strapi: Strapi}) => ({
  getSettingsAndLink: async (): Promise<IDnsSettings> => {
    const dnsSettings = await strapi.db.query('api::dns-setting.dns-setting').findOne();
    return {
      dnsSettings,
      merchantLink: `${dnsSettings.dns_payment_url}/${dnsSettings.payment_method}/${dnsSettings.endpoint_id}`
    };
  },
  getBillingSettings: async (): Promise<string> => {
    const dnsSettings = await strapi.db.query('api::dns-setting.dns-setting').findOne();
    return dnsSettings.billing_address;
  }
}));
