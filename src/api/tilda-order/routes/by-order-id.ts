export default {
  routes: [
    {
      method: 'GET',
      path: '/tilda-orders/by-order-id/:orderId',
      handler: 'tilda-order.byOrderId',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
