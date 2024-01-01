const pgp = require('pg-promise')();
const db = pgp({
    user: 'default',
    password: 'kUcVSQgGP92v',
    host: 'ep-jolly-bush-68193344-pooler.ap-southeast-1.postgres.vercel-storage.com',
    port: 5432, // default Postgres port
    database: 'verceldb',
    ssl: {
      rejectUnauthorized: false,
    },
});

module.exports = db;

