/**
 * A set of functions called "actions" for `downloads`
 */

import request from 'request';
import { decryptJson } from '../../utils';

export default {
  downloadFile: async (ctx) => {
    const { id } = ctx.params;

    const { salt: secret } =  strapi.config.get<Record<string, string>>('admin.apiToken');

    const { productName, fileName } = decryptJson(secret,id);

    const { dnsSettings } = await strapi.service('api::dns-setting.dns-setting').getSettingsAndLink();

    if (!dnsSettings || !productName || !fileName) {
      return ctx.notFound('file not found');
    }

    const fileUrl =
      dnsSettings.server_callback_url.substring(0, dnsSettings.server_callback_url.indexOf('/api')) +
      `/uploads/${fileName}.zip`;

    const response = await new Promise<any>((resolve, reject) => {
      request(fileUrl, (error, response, body) => {
        if (error) return reject(error);
        return resolve(response);
      });
    });

    if (response.statusCode !== 200) {
      ctx.throw(404, 'File not found or inaccessible'); // Handle error
    }

    ctx.set({
      'Content-Type': response.headers['content-type'],
      'Content-Disposition': `attachment; filename=${productName}.zip`,
    });

    ctx.body = response.body;
  },
};
