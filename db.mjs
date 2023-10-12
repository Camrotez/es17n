import pgPromise from "pg-promise";
const db = pgPromise()("postgres://postgres:passsql@localhost:5432");

export {db}