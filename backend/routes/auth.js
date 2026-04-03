const express = require("express");
const router = express.Router();
const User = require("../models/User");

// 📧 SendGrid setup
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// =======================
// ✅ SIGNUP ROUTE
// =======================
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Alert email
      try {
        await sgMail.send({
          to: email,
          from: process.env.EMAIL_USER, // verified sender
          subject: "Signup Attempt ⚠️",
          text: "Someone tried to signup using your email.",
        });
      } catch (err) {
        console.log("Signup alert email failed:", err.message);
      }

      return res.json({ message: "User already exists" });
    }

    // Save user
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Welcome email
    try {
      await sgMail.send({
        to: email,
        from: process.env.EMAIL_USER,
        subject: "Welcome 🎉",
        text: `Hello ${username}, welcome to our app!`,
      });
    } catch (err) {
      console.log("Signup email failed:", err.message);
    }

    return res.json({ message: "Signup successful" });

  } catch (error) {
    console.log("Signup Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// =======================
// ✅ LOGIN ROUTE
// =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // ❌ User not found
    if (!user) {
      return res.json({ message: "User not found" });
    }

    // ❌ Wrong password
    if (user.password !== password) {
      try {
        await sgMail.send({
          to: email,
          from: process.env.EMAIL_USER,
          subject: "Login Alert ⚠️",
          text: "Someone tried to login with wrong password.",
        });
      } catch (err) {
        console.log("Login alert email failed:", err.message);
      }

      return res.json({ message: "Invalid credentials" });
    }

    // ✅ SUCCESS EMAIL
    try {
      await sgMail.send({
        to: email,
        from: process.env.EMAIL_USER,
        subject: "Login Successful ✅",
        text: `Hello ${user.username}, you have successfully logged in.`,
      });
    } catch (err) {
      console.log("Login success email failed:", err.message);
    }

    return res.json({
      message: "Login successful",
      username: user.username,
    });

  } catch (error) {
    console.log("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;