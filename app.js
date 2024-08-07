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
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
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

//to login a user
app.post("/login", async (req, res) => {
  const { Email, Password } = req.body;
  try {
    const users = await prisma.user.findMany({
      where: {
        Email: Email,
      },
    });

    if (users.length === 0) {
      return res.status(404).send("Email not found!");
    }

    const user = users[0];

    console.log("The User found is:", user);
    console.log("The Email got is:", Email);

    // Make sure to use the correct casing for the password field
    const isPasswordValid = await bcrypt.compare(Password, user.Password);

    console.log(" the valid password extracted is:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).send("Invalid password! Try again");
    }

    // User authenticated successfully
    //generated jwt token with userdata, secretkey and expiry time
    const token = jwt.sign({ user, isPasswordValid }, secretKey, {
      expiresIn: "30m",
    });
    res.status(200).send({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while logging in.");
  }
});

//to fetch/access the profile of the user
app.get("/profile", (req, res) => {
  try {
    const headerData = req.headers["Authorization"];
    const token = headerData.split(" ")[1];
    res.send(`The token is ${token}`);
  } catch (error) {
    res.status(401).send(`"No token found `);
  }
});

app.post("/blood_request", async (req, res) => {
  const headerData = req.headers["authorization"];

  if (!headerData) {
    return res.status(401).send("LogIn required! No header Data found.");
  }

  const token = headerData.split(" ")[1];

  if (!token) {
    return res.status(401).send("LogIn required!");
  }

  const { BloodType, HospitalName, BloodPint, RequiredBy } = req.body;

  console.log(" The blood type got is:", BloodType);
  console.log(" The hosp name got is:", HospitalName);

  console.log(" The Bloodpint got is:", BloodPint);

  console.log(" The required date got is:", RequiredBy);

  // try {
  //   await prisma.bloodRequest.create({
  //     data: {
  //       BloodType,
  //       HospitalName,
  //       BloodPint,
  //       RequiredBy,
  //     },
  //   });
  // } catch (error) {
  //   console.log("Error inserting data!");
  //   return error;
  // }
});

// function verifyToken(req, res, next) {
//   const bearHeader = req.headers["authorization"];
//   const token = bearHeader.split(" ")[1];

//   req.token = token;

//   jwt.verify(token, secretKey, (err, decode) => {
//     if (err) {
//       res.send("Token mismatched");
//     }
//     req.decode = decode;
//   });
//   next();
// }

// app.get("/protected", verifyToken, (req, res) => {
//   const jwtToken = req.token;
//   const decodeVal = req.decode;
//   res.send(`Token claimed! ${jwtToken} and decoded value is ${decodeVal}`);
// });
