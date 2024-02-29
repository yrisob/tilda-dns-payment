export default {
  routes: [
    {
      method: 'POST',
      path: '/dns-payment/:clientOrderId',
      handler: 'dns-payment.getByClientOrderId',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    }
  ]
}
