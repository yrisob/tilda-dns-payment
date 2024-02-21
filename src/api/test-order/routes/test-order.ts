export default {
  routes: [
    // {
    //  method: 'GET',
    //  path: '/test-order',
    //  handler: 'test-order.exampleAction',
    //  config: {
    //    policies: [],
    //    middlewares: [],
    //  },
    // },
    {
      method: 'POST',
      path: '/test-order',
      handler: 'test-order.postTestOrder',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    }
  ],
};
