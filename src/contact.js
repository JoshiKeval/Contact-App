const db = require("./db");
const SECRET_KEY = "This Is My Rest Api With JWT";
const jwt = require("jsonwebtoken");

//////////////////////////////////////////////////////verifyuser

let verifyUser = (req, res, next) => {
  var token = req.headers["token"];
  console.log(token);
  if (!token) {
    return res.status(401).send({ auth: false, message: "No token provided." });
  }
  jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });
    }
    res.locals.isAuthenticated = true;
    res.locals.id = decoded.personalData.id;
    next();
  });
};

//////////////////////////////////////////////////////Create Conatct

async function createConatct(contactData) {
  let sqlStmt =
    "INSERT INTO contacts (name,email,phoneno,user_id) VALUES ($1,$2,$3,$4)";
  let { name, email, phoneno, user_id } = contactData;
  return db.query(sqlStmt, [name, email, phoneno, user_id]);
}

//////////////////////////////////////////////////////get Conatct

async function getConatct(name, userId) {
  let sqlStmt = "SELECT * FROM contacts WHERE user_id=$1 AND name=$2";
  let cname = name;
  let cuser_id = userId;
  return db.query(sqlStmt, [cuser_id, cname]);
}

///////////////////////////////////////////////////////////////updateContact

async function updateConatct(userData, conname, userId) {
  let sqlStmt =
    "UPDATE contacts SET name=$1,phoneno=$2 WHERE user_id=$3 AND email=$4";
  let { name, email, phoneno } = userData;
  let user_id = userId;
  return db.query(sqlStmt, [name, phoneno, user_id, email]);
}

//////////////////////////////////////////////////deleteContact

async function deleteConatct(demail, userId) {
  let sqlStmt = "DELETE FROM contacts WHERE user_id=$1 AND email=$2";
  let uemail = demail;
  let user_id = userId;
  return db.query(sqlStmt, [user_id, uemail]);
}

module.exports = {
  createConatct,
  verifyUser,
  getConatct,
  updateConatct,
  deleteConatct,
};
