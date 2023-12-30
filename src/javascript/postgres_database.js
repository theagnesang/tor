import pgPromise from 'pg-promise';

const pgp = pgPromise();

const config = {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
};

const db = pgp(config);

export default db;
