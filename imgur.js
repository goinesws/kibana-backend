// CommonJS syntax
const { ImgurClient } = require('imgur');

// all credentials with a refresh token, in order to get access tokens automatically
const imgur = new ImgurClient({
  clientId: "33df5c9de1e057a",
  clientSecret: "b71de205c2d7b73c4b27fcbc7ee6f00a40bca212",
  refreshToken: "986e7815c696be99c752d644eb593e4cbcb9cd61",
});

module.exports = imgur;