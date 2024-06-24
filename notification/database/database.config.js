export const {Pool} = require('pg')

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_SERVER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: port || undefined,
})