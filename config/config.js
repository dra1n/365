module.exports = {
    development: {
        public_dir: '/app'
      , instagram: {
          clientID: process.env.CLIENT_ID
        , clientSecret: process.env.CLIENT_SECRET
        , callbackURL: "http://4nhu.localtunnel.com/auth/instagram/callback"
        , subCallbackUrl: "http://4nhu.localtunnel.com/api/subscription"
        , accessToken: process.env.ACCESS_TOKEN
        , userId: process.env.USER_ID                                        // User feed. Maybe will remove later.
      }
    }
  , test: {
    }
  , production: {
        public_dir: '/public'
      , instagram: {
          clientID: process.env.CLIENT_ID
        , clientSecret: process.env.CLIENT_SECRET
        , subCallbackUrl: "http://365.eu01.aws.af.cm/api/subscription"
        , callbackURL: "http://365.eu01.aws.af.cm/auth/instagram/callback"
        , accessToken: process.env.ACCESS_TOKEN
      }
    }
}
