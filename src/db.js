const Pool = require("pg").Pool;
const jwt=require("jsonwebtoken");
const md5=require("md5");
const SECRET_KEY="This Is My Rest Api With JWT"

const pool = new Pool({
    user: process.env.user,
    host: "localhost",
    database: "crud",
    password: process.env.password,
    port: 5432,
  });



module.exports = {
    query: async(text, params) => await pool.query(text, params),
  }