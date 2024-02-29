import crypto from 'crypto';
export * from './mail';

export function getSha1(input: string): string {
  var shaSum = crypto.createHash('sha1');
  shaSum.update(input);
  return shaSum.digest('hex');
}

export function jsonToFormData(json: any): FormData {
  const formData = new FormData();
  Object.keys(json).forEach((key) => {
    formData.append(key, json[key]);
  });
  return formData;
}

export function separateCents(input: string): string {
  return (Number(input) / 100).toFixed(2);
}

// for more details see:  https://doc.dns-pay.com/integration_helpers/sha-1.html#sale-signature
export function getSaleSign({ endPoint, client_orderid, amount, email, merchant_control_key }): string {
  const inputString = `${endPoint}${client_orderid}${amount}${email}${merchant_control_key}`;
  return getSha1(inputString);
}

// for more details see: https://doc.payneteasy.com/integration_helpers/sha-1.html#callback-signature
export function getCallbackSignature({ status, orderid, merchant_order, merchant_control_key }): string {
  const verificationString = `${status}${orderid}${merchant_order}${merchant_control_key}`;

  return getSha1(verificationString);
}

export function getTildaSign(tildaSecret: string, { email, phone, order_id, login }): string {
  return getSha1(`${tildaSecret}|${email}|${phone}|${order_id}|${login}`);
}

export function encryptJson(secret: string, json: object): string {
  const cipher = crypto.createCipher('aes192', secret);

  let encrypted = cipher.update(JSON.stringify(json), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted
}

export function decryptJson(secret: string, encrypted: string): Record<string, any>{
  const decipher = crypto.createDecipher('aes192', secret);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted)
}
