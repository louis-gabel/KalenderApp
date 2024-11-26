const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../utils/db");

const register = async (req, res) => {
  try {
    const { email, password, prename, surname, role_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db("user").insert({
      email,
      password: hashedPassword,
      prename,
      surname,
      role_id,
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // find user by email
    const user = await db("user").where({ email }).first();

    // check if user exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // create a JWT token with user ID and role ID
    const token = jwt.sign(
      { id: user.user_id, role: user.role_id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };
