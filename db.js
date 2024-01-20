const pgp = require('pg-promise')();
const db = pgp({
    user: 'default',
    password: 'qlkjv4z5igpd',
    host: 'ep-summer-brook-48509940-pooler.ap-southeast-1.postgres.vercel-storage.com',
    port: 5432, // default Postgres port
    database: 'verceldb',
    ssl: {
      rejectUnauthorized: false,
    },
});

module.exports = db;
