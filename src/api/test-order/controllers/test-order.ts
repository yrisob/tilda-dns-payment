/**
 * A set of functions called "actions" for `test-order`
 */

export default {
  postTestOrder: async (ctx) => {
    const orderData = ctx.request.body;
    console.log(JSON.stringify(orderData, null, 2));

    ctx.body = 'ok';
  }

  // exampleAction: async (ctx, next) => {
  //   try {
  //     ctx.body = 'ok';
  //   } catch (err) {
  //     ctx.body = err;
  //   }
  // }
};
