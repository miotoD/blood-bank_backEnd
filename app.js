const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const prisma = require("./prisma");
const bcrypt = require("bcrypt");
const { Prisma } = require("@prisma/client");

const app = express();
const PORT = 3001;

const secretKey = "A2453DYSI";

app.use(bodyParser.json());
app.use(cors());

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});

app.get("/", (req, res) => {
  res.send("Hello");
});

//to register a User
app.post("/register", async (req, res) => {
  const { UserName, Email, Password } = req.body;
  console.log(" server side ma data:", req.body);
  const hashedPassword = await bcrypt.hash(Password, 10);
  try {
    const createUser = await prisma.user.create({
      data: {
        UserName,
        Email,
        Password: hashedPassword,
      },
    });
    res.send(
      `User Succesfully created with username: ${UserName} and email :${Email} and password is :${Password}`
    );
  } catch (error) {
    console.error(error);
  }
});

app.post("/login", (req, res) => {
  const userDetail = req.body;
  if (userDetail.username === "mioto" && userDetail.password === "pass123") {
    jwt.sign(userDetail, secretKey, (err, token) => {
      if (err) {
        res.send("Error generating token");
      }
      res.json({
        token,
      });
    });
  }
});

function verifyToken(req, res, next) {
  const bearHeader = req.headers["authorization"];
  const token = bearHeader.split(" ")[1];

  req.token = token;

  jwt.verify(token, secretKey, (err, decode) => {
    if (err) {
      res.send("Token mismatched");
    }
    req.decode = decode;
  });
  next();
}

app.get("/protected", verifyToken, (req, res) => {
  const jwtToken = req.token;
  const decodeVal = req.decode;
  res.send(`Token claimed! ${jwtToken} and decoded value is ${decodeVal}`);
});
