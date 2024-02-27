import axios from 'axios';
import * as qs from 'qs';
import { getSaleSign, separateCents } from '../../utils';
import { errors } from '@strapi/utils';

const { ApplicationError } = errors;

export default () => ({
  getPaymentLink:  async (payerAddressData) => {
    const { dnsSettings, merchantLink } = await strapi.service('api::dns-setting.dns-setting').getSettingsAndLink();

    //for more details see: https://doc.dns-pay.com/card_payment_API/sale-transactions.html#initiating-a-transaction-with-payment-form
    const formData = qs.stringify({
      client_orderid: payerAddressData.tilda_order.order_id,
      order_desc: payerAddressData.tilda_order.description,
      first_name: payerAddressData.first_name,
      last_name: payerAddressData.last_name,
      address1: payerAddressData.address1,
      city: payerAddressData.city,
      zip_code: payerAddressData.zip_code,
      country: payerAddressData.country_code,
      phone: payerAddressData.phone,
      amount: separateCents(payerAddressData.tilda_order.amount),
      email: payerAddressData.email,
      currency: dnsSettings.currency_code,
      ipaddress: payerAddressData.tilda_order.ipaddress,
      site_url: payerAddressData.tilda_order.order_from,
      redirect_success_url: `${dnsSettings.redirect_success_url}/${payerAddressData.tilda_order.order_id}`,
      redirect_fail_url: `${dnsSettings.redirect_failed_url}/${payerAddressData.tilda_order.order_id}`,
      server_callback_url: dnsSettings.server_callback_url,
      control: getSaleSign({
        endPoint: dnsSettings.endpoint_id,
        client_orderid: payerAddressData.tilda_order.order_id,
        amount: payerAddressData.tilda_order.amount,
        email: payerAddressData.email,
        merchant_control_key: dnsSettings.merchant_control_key,
      }),
    });

    const response = await axios.post(merchantLink, formData);

    var paymentLinkResponse: any;
    if (response.status === 200) {
      paymentLinkResponse = qs.parse((response.data as string).replace(/\n/g, ''));
    } else {
      throw new ApplicationError('Failed to create payment link:', response);
    }

    const {
      type,
      'serial-number': serial_number,
      'merchant-order-id': merchant_order_id,
      'paynet-order-id': paynet_order_id,
      'redirect-url': redirect_url,
    } = paymentLinkResponse;

    return strapi
      .service('api::dns-payment-link.dns-payment-link')
      .save({
        type,
        serial_number,
        merchant_order_id,
        paynet_order_id,
        redirect_url,
        payer_address: { id: payerAddressData.id },
      });;
  }
});
