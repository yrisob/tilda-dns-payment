export default {
  routes: [
    {
      method: 'GET',
      path: '/downloads/:id',
      handler: 'downloads.downloadFile',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
