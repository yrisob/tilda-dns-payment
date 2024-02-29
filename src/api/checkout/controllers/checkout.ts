import * as qs from 'qs';
import { encryptJson, getCallbackSignature, getPersonalEmail } from '../../utils';

export default {
  startCheckout: async (ctx) => {
    const orderData = ctx.request.body;
    const ipaddress = ctx.request.header['x-forwarded-for'];
    const order_from = ctx.request.header['origin'];

    const tildaOrder = { ...orderData, ipaddress, order_from };
    const tildaOrderData = await strapi.service('api::tilda-order.tilda-order').save(tildaOrder);

    const redirectUrl = await strapi.service('api::dns-setting.dns-setting').getBillingSettings();
    ctx.redirect(`${redirectUrl}/${tildaOrderData.order_id}`);
    return;
  },
  getPaymentLink: async (ctx) => {
    const payerAddressData = ctx.request.body;

    const payerAddress = await strapi.service('api::payer-address.payer-address').createPayerAddress(payerAddressData);

    return strapi.service('api::checkout.checkout').getPaymentLink(payerAddress);
  },
  getPaymentApprove: async (ctx) => {
    const query = ctx.request.query;
    const checkoutData = qs.parse(query);

    const { dnsSettings } = await strapi.service('api::dns-setting.dns-setting').getSettingsAndLink();

    const verificationHash = getCallbackSignature({
      status: checkoutData.status,
      orderid: checkoutData.orderid,
      merchant_order: checkoutData.merchant_order,
      merchant_control_key: dnsSettings.merchant_control_key,
    });

    if (verificationHash !== checkoutData.control) {
      ctx.throw(403, 'Invalid sign');
    }

    console.log('=============== Checkout data ==============');
    console.log(JSON.stringify(checkoutData, null, 2));
    console.log('=============== Checkout header =============');
    console.log(ctx.request.header);
    console.log('============================================');

    const existingPaymentLink = await strapi
      .service('api::dns-payment-link.dns-payment-link')
      .getByPaynetOrderId(checkoutData.orderid);

    if (!existingPaymentLink) {
      ctx.throw(404, 'Payment link not found');
    }

    const dnsPayment = await strapi
      .service('api::dns-payment.dns-payment')
      .save(checkoutData, { id: existingPaymentLink.id });

    if (dnsPayment.status === 'approved') {
      strapi.service('api::checkout.checkout').tildaApprove(dnsPayment);
    }

    return dnsPayment;
  },
  tildaWebhookHandler: async (ctx) => {
    const request = ctx.request.body;
    const { name, email, payment } = request;

    console.log('=============== Tilda webhook data ==============');
    console.log(JSON.stringify(ctx.request.body, null, 2));
    console.log('================================================');

    if (!name || !email || !payment) {
      return { success: true };
    }

    strapi.service('api::tilda-approve.tilda-approve').saveWithDnsPayment(request);

    const { salt: secret } = strapi.config.get<Record<string, string>>('admin.apiToken');

    const { dnsSettings } = await strapi.service('api::dns-setting.dns-setting').getSettingsAndLink();
    const backUrl = dnsSettings.server_callback_url;

    const products = payment?.products?.map((item) => ({
      name: item.name,
      link: `${backUrl.substring(0,backUrl.indexOf('/api'))}/api/downloads/${encryptJson(secret, { productName: item.name, fileName: item.sku.replace('axorweb', '') })}`,
    }));

    strapi
      .plugin('email')
      .service('email')
      .send({
        to: email,
        from: 'dontreplay@axorweb.com',
        replyTo: 'dontreplay@axorweb.com',
        subject: `Your order: ${payment.orderid}`,
        text: `Thank you for your payment, ${name}!`,
        html: getPersonalEmail(name, products),
      });

    return ctx.send({ status: 'ok' });
  },
};
