/**
 * A set of functions called "actions" for `test-order`
 */

export default {
  postTestOrder: async (ctx) => {
    const orderData = ctx.request.body;
    console.log('=============== Payment data ==============')
    console.log(JSON.stringify(orderData, null, 2));
    console.log('=============== Payment header =============')
    console.log(ctx.request.header);
    console.log('============================================')

    ctx.body = 'ok';
  }

};
