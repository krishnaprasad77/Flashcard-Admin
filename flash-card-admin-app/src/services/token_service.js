import Cookies from 'js-cookie';

import { requestTokenUrl } from '../config/app_urls';

import TokenEntity from '../entity/token_entity';


async function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export default class TokenService {
  static async getTokenEntity() {

    let refToken = Cookies.get('fart');
    let accToken = Cookies.get('faat')
    let splitedaccToken = accToken?.split('1fArT1-')
    
    return new TokenEntity({
      refreshToken: refToken,
      accessToken: splitedaccToken[1],
      requestTokenUrl: requestTokenUrl,
    });

  }




  static async cleanTokenEntity() {

    Cookies.remove('fart');

    Cookies.remove('faat');

  }


  static async setTokenEntity({ refreshToken, accessToken }) {
    // randomString + 1fArT1- + accToken
    
    const randomString = await generateRandomString(10);
    var concatString = randomString + '1fArT1-'
    Cookies.set('fart', refreshToken);

    Cookies.set('faat', concatString + accessToken);

    return new TokenEntity({
      refreshToken: refreshToken,
      accessToken: accessToken,
      requestTokenUrl: requestTokenUrl,
    });

  }
}