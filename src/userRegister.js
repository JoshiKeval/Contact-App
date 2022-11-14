const db = require("./db");
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const SECRET_KEY = "This Is My Rest Api With JWT";

// const createUser = (req, res) => {
//   const { name, email, phoneno, password } = req.body;

//   pool.query(
//     "INSERT INTO userregister(name,email,phoneno,password) VALUES($1,$2,$3,$4) RETURNING *",
//     [name, email, phoneno, md5(password)],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.status(200).send({auth:false,message:"Register Faild"})
//         throw err;
//       }
//       res.status(200).json({
//         msg: "User Created Succesfully",
//         data: result.rows[0],
//       });
//     }
//   );
// };

async function createUser(userData) {
  try {
    let sqlStmt =
      "INSERT INTO userregister(name,email,phoneno,password) VALUES($1,$2,$3,$4) RETURNING *";
    let { name, email, phoneno, password } = userData;
    let result = await db.query(sqlStmt, [name, email, phoneno, md5(password)]);
    console.log("Register...");
    return result;
  } catch (error) {
    console.log("Email Already Used....");
  }
}

async function getUser() {
  let sqlStmt = "SELECT * FROM  userregister";
  return db.query(sqlStmt, []);
}

const getUserID = (req, res) => {
  let id = parseInt(req.params.id);

  db.query("SELECT*FROM  userregister WHERE id=$1 ", [id], (err, result) => {
    if (err) {
      throw err;
    }
    res.json({
      data: result.rows,
    });
  });
};

const updateUser = (req, res) => {
  let id = parseInt(req.params.id);
  let { name, email, phoneno, password } = req.body;

  db.query(
    "UPDATE userregister SET name=$1,email=$2,phoneno=$3,password=$4 WHERE id=$5",
    [name, email, phoneno, password, id],
    (err, result) => {
      if (err) {
        throw err;
      }
      res.json({
        data: "User Updated...",
      });
    }
  );
};

const deleteUser = (req, res) => {
  let id = parseInt(req.params.id);

  db.query("DELETE FROM userregister WHERE id=$1", [id], (err, result) => {
    if (err) {
      throw err;
    }
    res.json({
      msg: `${id} User Deleted....`,
    });
  });
};

///////////////////////////////////////////////////////login process

async function loginUser(loginData) {
  let sqlStmt =
    "SELECT * FROM userregister where email=$1 and password=$2 limit 1";
  let { email, password } = loginData;
  let data = await db.query(sqlStmt, [email, md5(password)]);
  // console.log(data)

  if (data.rowCount > 0) {
    // let {email,name,id,phoneno}=data.rows[0];
    let personalData = { email: data.rows[0].email, id: data.rows[0].id };
    let expIn = 24 * 60 * 60;
    let token = jwt.sign({ personalData }, SECRET_KEY, { expiresIn: expIn });
    console.log("login Sucseefully");
    // console.log(token)
    return token;
  } else {
    console.log("Auth Fail...");
  }
}

module.exports = {
  createUser,
  getUser,
  getUserID,
  updateUser,
  deleteUser,
  loginUser,
};
