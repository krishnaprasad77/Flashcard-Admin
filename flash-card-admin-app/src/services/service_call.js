import axios from 'axios';
import appConfig from '../config/app_config.json';

export default class ServiceCall {

  constructor({ tokenEntity, updateTokenEntity, checkNetwork }) {
    this.tokenEntity = tokenEntity;
    this.updateTokenEntity = updateTokenEntity;
    this.checkNetwork = checkNetwork;
  }
  
  async postCall({ url, body }) {
    return await this.httpCall({
      serviceCallCb: async () =>
        !body
          ? await axios.post(url, this.getAxiosObject())
          : await axios.post(url, body, this.getAxiosObject()),
    });
  }
  async getCall({ url, body }) {
    console.log('servicecall');
    console.log('url', url, 'body');
    return await this.httpCall({
      serviceCallCb: async () =>
        !body
          ? await axios.get(url, this.getAxiosObject())
          : await axios.get(url, body, this.getAxiosObject()),
    });
  }
  async deleteCall({ url, body }) {
    return await this.httpCall({
      serviceCallCb: async () =>
        !body
          ? await axios.delete(url, this.getAxiosObject())
          : await axios.delete(url, body, this.getAxiosObject()),
    });
  }
  async putCall({ url, body }) {
    return await this.httpCall({
      serviceCallCb: async () =>
        !body
          ? await axios.put(url, this.getAxiosObject())
          : await axios.put(url, body, this.getAxiosObject()),
    });
  }
  async httpCall({ serviceCallCb, authServiceCallCb }) {
    try {
      console.log('servicecallhttp');
      if (await this.checkNetwork()) {
        var res = authServiceCallCb
          ? await authServiceCallCb()
          : await serviceCallCb();

        if (res.status == 200) {

          if (authServiceCallCb && res.data.token) {

            await this.updateTokenEntity({ refToken: res.data.token.refreshToken, accToken: res.data.token.accessToken })
            this.tokenEntity.accessToken = res.data.token.accessToken
            return await serviceCallCb();
          } else {

            return res.data;
          }
        } else {

          return {
            header: {
              code: appConfig.statusCode.ServerError,
            },
          };
        }
      } else {
        return {
          header: {
            code: appConfig.statusCode.NoNetConn,
          },
        };
      }


    } catch (e) {
      if (e.response && e.response.status == 401) {

        return this.handleAuthorization({
          serviceCallCb: () => {
            return this.httpCall({ serviceCallCb });
          },
        });
      } else if (e.response && e.response.status == 417) {

        return {
          header: {
            code: appConfig.statusCode.TokenExpires,
          },
        };
      } else {


        return {
          header: {
            code: appConfig.statusCode.ServerError,
          },
        };
      }
    }
  }

  getNetworkStatus() {

  }

  async handleAuthorization({ serviceCallCb }) {
    return await this.httpCall({
      serviceCallCb: serviceCallCb,
      authServiceCallCb: async () => {
        let payload = {
          refreshToken: this.tokenEntity.refreshToken
        }
        return await axios.post(this.tokenEntity.requestTokenUrl, payload, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
          }
        });
      },

    });
  }
  getHeader() {
    console.log('header');
    return this.tokenEntity.accessToken
      ? {
        'Access-Control-Allow-Origin': '*',
        'Content-type': 'application/json',
        'Authorization': `Bearer ${this.tokenEntity.accessToken}`,
      }
      : {
        'Access-Control-Allow-Origin': '*',
        'Content-type': 'application/json',
      };
  }
  getAxiosObject() {
    return {
      headers: this.getHeader(),
      // withCredentials: true,
    };
  }
}
