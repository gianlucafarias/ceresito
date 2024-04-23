import { PostgreSQLAdapter as Database } from './postgresql-adapter';

export const database = new Database({
    host: process.env.POSTGRES_DB_HOST,
    user: process.env.POSTGRES_DB_USER,
    database: process.env.POSTGRES_DB_NAME,
    password: process.env.POSTGRES_DB_PASSWORD,
    port: +process.env.POSTGRES_DB_PORT,
})

