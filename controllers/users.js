const connection = require("../connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../nodemailer");

const userDetails = async (req, res) => {
  const selectQuery = "SELECT * FROM cft";
  connection.query(selectQuery, (err, results) => {
    if (err) {
      console.error("Error fetching data: " + err.stack);
      res.status(500).send("Error fetching data");
      return;
    }
    res.status(200).json({message:"Successfully fetched user details using jwt",results:results});
  });
};

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log(req.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const insertQuery = `INSERT INTO cft (firstName, lastName, email, password) VALUES ('${firstName}','${lastName}','${email}','${hashedPassword}');`;
    const selectEmailQuery = `SELECT * FROM cft WHERE email = '${email}'`;

    connection.query(selectEmailQuery, [email], (err, results) => {
      if (err) {
        console.error("Error searching for email: " + err.stack);
        return false;
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "User already exist." });
      } else {
        connection.query(
          insertQuery,
          [firstName, lastName, email, password],
          async (err, result) => {
            if (err) {
              console.error("Error registering user: " + err.stack);
              res.status(500).send("Error registering user");
              return;
            }
            console.log("User registered successfully");
            const token = jwt.sign({ email: email }, process.env.SECRET_KEY, {
              expiresIn: "1h",
            });
            console.log(result);
            res.status(200).json({
              message: "User Registered Successfully",
              token: token,
            });
          }
        );
      }
    });
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email)

  try {
    const loginQuery = `SELECT * FROM cft WHERE email = '${email}'`;

    connection.query(loginQuery, [email], async (err, results) => {
      if (err) {
        console.error("Error searching for email: " + err.stack);
      }

      const existingUser = results[0].email;
      const existingPassword = results[0].password;
      if (existingUser == email) {
        const isPasswordCorrect = await bcrypt.compare(
          password,
          existingPassword
        );

        if (!isPasswordCorrect)
          return res
            .status(400)
            .json({ message: "Email or Password is incorrect." });

        const token = jwt.sign({ email: email }, process.env.SECRET_KEY, {
          expiresIn: "1h",
        });

        res.status(200).json({ message: "Login Successfully", token: token });
      } else {
        return res.status(404).json({ message: "User doesn't exist." });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const query = `SELECT * FROM cft WHERE email = '${email}'`;

  connection.query(query, async (err, results) => {
    if (err) {
      console.error("Error searching for email: " + err.stack);
    }
    const existingUser = results[0];

    if (existingUser == null) {
      res.status(400).send("Cannot find user");
      return;
    }

    console.log(existingUser);
    const secret = process.env.JWT_SECRET + existingUser.password;
    const payload = { email: existingUser.email };

    const token = jwt.sign(payload, secret, { expiresIn: "5m" });

    const link = `http://localhost:5000/users/auth/forget-password/${existingUser.id}/${token}`;

    try {
      sendEmail(email, link);
      res.status(200).json({ success: "Email sent successfully", link: link });
    } catch (err) {
      res.status(500).send();
      console.log(err);
    }
  });
};

const updatePassword = async (req, res) => {
  const { id, token } = req.params;
  const query = `SELECT * FROM cft WHERE id = '${id}'`;
  connection.query(query, async (err, results) => {
    if (err) {
      console.error("Error searching for email: " + err.stack);
    }
    const existingUser = results[0];
    const secret = process.env.JWT_SECRET + existingUser.password;

    if (existingUser == null) {
      res.status(400).send("Cannot find user");
      return;
    }

    try {
      const payload = jwt.verify(token, secret);
      console.log(payload);
      res.render("reset-password", { email: payload.email });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  });
};

const newPassword = async (req, res) => {
  const { id } = req.params;
  const { password, password2 } = req.body;
  const query = `SELECT * FROM cft WHERE id = '${id}';`;
  connection.query(query,async (err,results)=>{
    if (err) {
      console.error("Error searching for email: " + err.stack);
    }
    
    const existingUser = results[0];
    
    if (existingUser == null) {
      res.status(400).send("Cannot find user");
      return;
    }
    if (!password == password2) {
      res.status(400).json({ message: "Password and confirm password are not same" });
      return;
    }
    try {
      const hashedPassword = await bcrypt.hash(`'${password}'`, 12);
      
      const query2 = `UPDATE cft SET password = ${hashedPassword} WHERE id = '${id}';`
      connection.query(query2, async (err,results)=>{
        if (err) {  
          console.error("Error searching for email: " + err.stack);
        }
        res.status(201).json({ message: "Password updated successfully"});
      })
  
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  })
  
};

module.exports = {
  registerUser,
  userDetails,
  loginUser,
  forgotPassword,
  updatePassword,
  newPassword,
};
