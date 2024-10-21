export default class TokenEntity {
    constructor({refreshToken, accessToken, requestTokenUrl, userType}) {
      this.refreshToken = refreshToken;
      this.accessToken = accessToken;
      this.requestTokenUrl = requestTokenUrl;
      this.userType = userType;
    }
}
  