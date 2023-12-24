const { Pool } = require('pg');

const pool = new Pool({
  user: 'default',
  password: 'kUcVSQgGP92v',
  host: 'ep-jolly-bush-68193344-pooler.ap-southeast-1.postgres.vercel-storage.com',
  port: 5432, // default Postgres port
  database: 'verceldb',
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};