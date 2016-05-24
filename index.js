var crypto = require('crypto');
var assert = require('assert');

module.exports = function disqusSSO (options) {
  assert(typeof options === 'object');
  assert(options.publicKey);
  assert(options.secret);

  var publicKey = options.publicKey;
  var secret = options.secret;

  function encode (data) {
    var message = new Buffer(JSON.stringify(data)).toString('base64');
    var timestamp = Math.round(+new Date() / 1000);
    var signature = crypto
      .createHmac('sha1', secret)
      .update(message + ' ' + timestamp)
      .digest('hex');

    return {
      pubKey: publicKey,
      auth: message + " " + signature + " " + timestamp
    };
  }

  return {
    login: function (req, res, next) {
      var payload = { pubKey: publicKey, auth: '' };
      if (typeof req.user === 'object') {
        payload = encode({
          id: req.user.id,
          username: req.user.fullName,
          email: req.user.email,
          avatar: req.user.avatar
        });

        req.user.disqus = payload;
      }

      if (typeof req.session === 'object') {
        req.session.disqus = payload;
      }

      next();
    },

    logout: function (req, res, next) {
      var payload = encode({});

      if (typeof req.user === 'object') {
        req.user.disqus = payload;
      }

      if (typeof req.session === 'object') {
        req.session.disqus = payload;
      }

      next();
    }
  }
}
