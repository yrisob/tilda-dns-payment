export default {
  routes: [
    {
     method: 'POST',
     path: '/account/verify-email',
     handler: 'account.verifyEmail',
     config: {
       auth: false,
       policies: [],
       middlewares: [],
     },
    },
    {
     method: 'POST',
     path: '/account/orders',
     handler: 'account.getAccountOrders',
     config: {
       auth: false,
       policies: [],
       middlewares: [],
     },
    },
  ],
};
