/**
 * session service
 */

import { Strapi, factories } from '@strapi/strapi';
import { encryptJson } from '../../utils';


export default factories.createCoreService('api::session.session', ({strapi}: {strapi: Strapi}) => ({
  refreshByEmail: async (email: string) => {
    return  strapi.db.query('api::session.session').deleteMany({where: {email}});
  },
  createNewSession: async (email: string) => {
    const date = Date.now();

    const { salt: secret } = strapi.config.get<Record<string, string>>('admin.apiToken');

    const encryptedJson = encryptJson(secret, { email, date });
    const access_code = encryptedJson.substring(encryptedJson.length -7);

    return strapi.db.query('api::session.session').create({data: {email, access_code}});
  },
  getByEmailAndAccessCode: async (email: string, access_code: string) => {
    return strapi.db.query('api::session.session').findOne({where: {email, access_code}});
  }
}));
