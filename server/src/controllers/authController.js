const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../utils/db");

const register = async (req, res) => {
  try {
    const { email, titel, prename, surname, role, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Dynamically fetch the role_id from the roles table
    const roleEntry = await db("role")
      .whereRaw("LOWER(role_name) = ?", [role.toLowerCase()])
      .first();

    const role_id = roleEntry.role_id;

    // Check if the user already exists
    const existingUser = await db("user").where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    await db("user").insert({
      email,
      titel: titel || null, // if titel is not provided, set it to null
      prename,
      surname,
      role_id,
      password: hashedPassword,
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

    // Fetch role name based on role_id
    const role = await db("role").where({ role_id: user.role_id }).first();

    // create a JWT token with user ID and role ID
    const token = jwt.sign(
      { id: user.user_id, role: user.role_id, role_id: role.role_id, user_id: user.user_id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res
      .status(200)
      .json({ token, role: role.role_name, role_id: role.role_id, user_id: user.user_id});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };
