/**
 * A set of functions called "actions" for `account`
 */

import { decryptJson, encryptJson, transformProduct } from "../../utils";
import {errors} from '@strapi/utils';

const {ForbiddenError} = errors;

export default {
  // exampleAction: async (ctx, next) => {
  //   try {
  //     ctx.body = 'ok';
  //   } catch (err) {
  //     ctx.body = err;
  //   }
  // }
  verifyEmail: async (ctx) => {
    const {email} = ctx.request.body;

    const isMadePurchases = await strapi.service('api::account.account').madePurchases(email);

    if (isMadePurchases) {
      const session = await strapi.service('api::session.session').createNewSession(email);

      const { salt: secret } = strapi.config.get<Record<string, string>>('admin.apiToken');

      const encryptSession = encryptJson(secret, session);

      const {dnsSettings} = await strapi.service('api::dns-setting.dns-setting').getSettingsAndLink();

      const access_link = `${dnsSettings.account_url}/account/${encryptSession}/my-orders`;


      if (session?.email && session?.access_code) {
        strapi
        .plugin('email')
        .service('email')
        .send({
          to: session?.email,
          from: 'Support@axorweb.com',
          replyTo: 'Support@axorweb.com',
          subject: `Your access code for AxorWeb`,
          text: `You code for access:`,
          html: `<p>To access the list of your orders, follow the link <b><a href="${access_link}">my orders</a></b></p>`,
        });
      }
    }

    return ctx.send({ status: 'ok' });
  },
  getAccountOrders: async (ctx) => {
    const {session} = ctx.request.body;

    const { salt: secret } = strapi.config.get<Record<string, string>>('admin.apiToken');

    let decryptedSession: Record<string, any>;
    try{
      decryptedSession = decryptJson(secret, session);
    }catch(e){
      throw new ForbiddenError('Your access is forbidden. Please, login again.');
    }

    if (decryptedSession?.email && decryptedSession?.access_code) {
      const session = await strapi.service('api::session.session').getByEmailAndAccessCode(decryptedSession.email, decryptedSession.access_code);

      if (!!session?.email) {
        const approvedOrders = await strapi.service('api::tilda-approve.tilda-approve').getApprovedOrdersByEmail(session.email);

        const { dnsSettings } = await strapi.service('api::dns-setting.dns-setting').getSettingsAndLink();
        const backUrl = dnsSettings.server_callback_url;

        const transformedApprovedOrders = approvedOrders.map((order) => {
          return {
            ...order,

            payment: {
              ...order?.data.payment,
              products: order.data.payment.products.map((product) => transformProduct(product, backUrl, secret))
            },
            data: undefined,
          };
        });

        return ctx.send(transformedApprovedOrders);
      }
    }

    throw new ForbiddenError('Your access is forbidden. Please, login again.');
  }
};
