import { Strapi } from "@strapi/strapi";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: {strapi:Strapi}) {
    if (strapi.plugin('documentation')){
      const override = {
        paths:  {
          '/orders/checkout': {
            post: {
              tags: ['Order'],
              summary: 'Checkout an order',
              description: 'Checkout an order',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                    }
                  }
                }
              },
              responses: {
                '200': {
                  description: 'Order checkout',
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/Order'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };

      strapi.plugin('documentation').service('override').registerOverride(override);
    }
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
