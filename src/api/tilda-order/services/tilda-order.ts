/**
 * tilda-order service
 */

import { factories } from '@strapi/strapi';
import {errors} from '@strapi/utils'
import { getSha1, getTildaSign } from '../../utils';


const {ForbiddenError, ApplicationError} = errors;

export default factories.createCoreService('api::tilda-order.tilda-order', ({ strapi }) => ({
  getByOrderId: async (order_id: string) => {
    return strapi.db.query('api::tilda-order.tilda-order').findOne({where: {order_id}});
  },
  save: async (orderData: any) => {
    const tildaSecret = strapi.config.get<string>('tilda.secretKey');

    const actualSign = getTildaSign(tildaSecret, orderData);

    if (actualSign !== orderData.sign){
      throw new ForbiddenError('Invalid sign');
    }

    let existingOrder = await strapi.service('api::tilda-order.tilda-order').getByOrderId(orderData.order_id);

    if (existingOrder){
      existingOrder = await strapi.entityService.update('api::tilda-order.tilda-order', existingOrder.id, {data: {...orderData, data:orderData}});

    }else {
      existingOrder= await strapi.entityService.create('api::tilda-order.tilda-order', {data: {...orderData, data:orderData}});
    }

    return strapi.db.query('api::tilda-order.tilda-order').findOne({where: {id: existingOrder.id}});
  },
  saveTildaOrderAndRedirect: async (orderData: any) => {
    const isValidSign = strapi.service('api::tilda-order.tilda-order').checkTildaSign(orderData);

    if (!isValidSign){
      throw new ForbiddenError('Invalid sign');
    }

    const existingOrder = await strapi.service('api::tilda-order.tilda-order').getByOrderId(orderData.order_id);

    if (existingOrder){
      await strapi.entityService.update('api::tilda-order.tilda-order', existingOrder.id, {data: orderData});

    } else {
      await strapi.entityService.create('api::tilda-order.tilda-order', {data: orderData});
    }

    const redirectUrl = await strapi.service('api::dns-setting.dns-setting').getBillingSettings();
    return `${redirectUrl}/${orderData.order_id}`

  }
}));
