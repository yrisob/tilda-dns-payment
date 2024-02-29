export default {
  routes: [
    {
      method: 'POST',
      path: '/checkout',
      handler: 'checkout.startCheckout',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
     method: 'GET',
     path: '/checkout/approve',
     handler: 'checkout.getPaymentApprove',
     config: {
       auth: false,
       policies: [],
       middlewares: [],
     },
    },
    {
     method: 'POST',
     path: '/checkout/get-payment-link',
     handler: 'checkout.getPaymentLink',
     config: {
       auth: false,
       policies: [],
       middlewares: [],
     },
    },
    {
      method: 'POST',
      path: '/checkout/tilda-approve',
      handler: 'checkout.tildaWebhookHandler',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    }
  ],
};
