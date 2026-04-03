const express = require("express");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

// 📧 Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// =======================
// ✅ SIGNUP ROUTE
// =======================
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 🔍 Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Send alert email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Signup Attempt ⚠️",
        text: "Someone tried to signup using your email.",
      });

      return res.json({ message: "User already exists" });
    }

    // 💾 Save new user
    const emailClean = email.trim().toLowerCase();
    const newUser = new User({ username, email: emailClean, password });
    

    // 🎉 Welcome email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome 🎉",
      text: `Hello ${username}, welcome to our app!`,
    });

    return res.json({ message: "Signup successful" });

  } catch (error) {
    console.log("Signup Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// =======================
// ✅ LOGIN ROUTE (IMPROVED)
// =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Find user
    const emailClean = email.trim().toLowerCase();
    const user = await User.findOne({ email: emailClean, });

    // ❌ User not found
    if (!user) {
      return res.json({ message: "User not found" });
    }

    // ❌ Wrong password
    if (user.password !== password) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Login Alert ⚠️",
          text: "Someone tried to login with wrong password.",
        });
      } catch (mailError) {
        console.log("Email Error:", mailError);
      }

      return res.json({ message: "Invalid credentials" });
    }

    // ✅ Success
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