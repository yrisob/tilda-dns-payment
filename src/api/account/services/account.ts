/**
 * account service
 */

import {errors} from '@strapi/utils';

const {NotFoundError} = errors;

export default () => ({
  madePurchases: async (email) => {
    const approvedOrders = await strapi.service('api::dns-payment.dns-payment').getApprovedOrdersByEmail(email);
    if (approvedOrders.length > 0) {
      strapi.service('api::session.session').refreshByEmail(email);
      return true;
    } else {
      throw new NotFoundError('User not found. Prior to authorization, you need to make purchases.');
    }
  }
});
