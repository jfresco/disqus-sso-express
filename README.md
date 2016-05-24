# Disqus SSO Express middleware
Express middleware aimed to make [SSO with Disqus](https://help.disqus.com/customer/portal/articles/236206) a little easier.

It does not replaces all the code you need to implement SSO with Disqus in your web app, it just tries to provide
a more elegant solution to the backend code. See the Disqus docs for more information.

## Installation
```
npm install --save disqus-sso-express
```

## How to use
In the following example we are using `passport` to handle authentication via Twitter OAuth server. You can use
the authentication method you want, but have in mind that `disqus-sso-express` middleware expects to have an
object in the `req.user` property.

```js
// Get `express` instance
var app = express()

// Require disqus-sso-express module and instantiate it with your API credentials
var disqus = require('disqus-sso-express')({
  publicKey: 'your disqus public key',
  secret: 'your disqus secret'
})

// Login route. A `req.user` object should be generated before putting the `disqus.login` middleware
app.get('/auth/github/callback',
  passport.authenticate('github'),
  disqus.login,
  redirect);

// Logout route
app.get('/logout',
  disqus.logout,
  function (req, res, next) {
    res.redirect('/');
  });
```

## Contributing
If you find a bug, want a feature or have a question, open an issue. PRs are also accepted.
