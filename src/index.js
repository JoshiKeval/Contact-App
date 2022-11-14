const exprees = require("express");
const app = exprees();
const dotenv = require("dotenv");
dotenv.config();
const userR = require("./userRegister");
const contact = require("./contact");

app.use(exprees.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/add", async (req, res) => {
  let data = await userR.createUser(req.body);
  res.send(data);
});

app.get("/alluser", async (req, res) => {
  let data = await userR.getUser();
  res.send(data);
});

app.post("/login", async (req, res) => {
  let data = await userR.loginUser(req.body);
  if (data) {
    res.send({
      auth: true,
      access_token: data,
      msg: "done!!",
    });
  } else {
    console.log(err);
    res.send({ msg: "Auth Failed" });
  }
});

////////////////////////////////////////////////////////////////////////contact

app.post("/verify", contact.verifyUser);

app.post("/addcontact", contact.verifyUser, async (req, res) => {
  let { name, email, phoneno } = req.body;
  // console.log("ff", res.locals.id);
  let id = res.locals.id;
  let data = await contact.createConatct({ name, email, phoneno, user_id: id });
  res.send(data);
  console.log("Contact Added...")
});

app.get("/getcontact", contact.verifyUser, async (req, res) => {
  if (res.locals.isAuthenticated) {
    let userName = req.body.name;
    let userId = res.locals.id;
    console.log(userId);
    let data = await contact.getConatct(userName, userId);
    res.send(data);
  } else {
    console.log("Failed");
  }
});

app.put("/updatecontact", contact.verifyUser, async (req, res) => {
  if (res.locals.isAuthenticated) {
    let userName = req.body.name;
    let userId = res.locals.id;
    console.log(req.body);
    // console.log(userId)
    let data = await contact.updateConatct(req.body,userName,userId);
    res.send(data);
    console.log("Contact Updated....")
  } else {
    console.log("Failed");
  }
});

app.delete("/deletecontact", contact.verifyUser, async (req, res) => {
  if (res.locals.isAuthenticated) {
    let userEmail = req.body.email;
    let userId = res.locals.id;
    let data = await contact.deleteConatct(userEmail,userId);
    res.send(data);
    console.log("Contact Deleted...")
  } else {
    console.log("Failed");
  }
});



// app.get("/:id", userR.getUserID);
// app.put("/:id", userR.updateUser);
// app.delete("/:id", userR.deleteUser);

app.listen(8000, () => {
  console.log("Server Is Running");
});
