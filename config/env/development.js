'use strict';

module.exports = {
  db: 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + '/mean-dev',
  debug: true,
  logging: {
    format: 'tiny'
  },
  //  aggregate: 'whatever that is not false, because boolean false value turns aggregation off', //false
  aggregate: false,
  mongoose: {
    debug: false
  },
  hostname: 'http://localhost:3000',
  app: {
    name: 'DEV Income Perspectives dcMax'
  },
  strategies: {
    local: {
      enabled: true
    },
    landingPage: '/',
    facebook: {
      clientID: '432217886986234',
      clientSecret: '3abd5f79ef3fe441452683c908405046',
      callbackURL: 'http://localhost:3000/api/auth/facebook/callback',
      enabled: true
    },
    twitter: {
      clientID: 'sOcsYeIH7wMZSTt3sInP6u0aD',
      clientSecret: 'scAowFMjw3B7JH5sSagzjHkT4qKIkfHqTYubZTKMVAc6YAimjr',
      callbackURL: 'http://localhost:3000/api/auth/twitter/callback',
      enabled: true
    },
    github: {
      clientID: 'DEFAULT_APP_ID',
      clientSecret: 'APP_SECRET',
      callbackURL: 'http://localhost:3000/api/auth/github/callback',
      enabled: false
    },
    google: {
      clientID: '756339539136-dd19pcakc8etik7kre4kardck523kfsu.apps.googleusercontent.com',
      clientSecret: 'R4vdB4PHwfDlkL7XMYSdtjXF',
      callbackURL: 'http://localhost:3000/api/auth/google/callback',
      enabled: true
    },
    linkedin: {
      clientID: 'DEFAULT_API_KEY',
      clientSecret: 'SECRET_KEY',
      callbackURL: 'http://localhost:3000/api/auth/linkedin/callback',
      enabled: false
    }
  },
  emailFrom: 'SENDER EMAIL ADDRESS', // sender address like ABC <abc@example.com>
  mailer: {
    service: 'SERVICE_PROVIDER', // Gmail, SMTP
    auth: {
      user: 'EMAIL_ID',
      pass: 'PASSWORD'
    }
  },
  secret: 'j0ck$Trap'
};
