const express = require("express");
const passport = require("../config/passport");
const { redirectToDashboard } = require("../controllers/authController");

const router = express.Router();

router.get("/github", passport.authenticate("github", { scope: ["repo"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  redirectToDashboard
);

router.get("/user", (req, res) => {
  console.log("Session:", req.session);
  console.log("User:", req.user);
  if (req.user) {
    res.json({ user: req.user.profile, accessToken: req.user.accessToken });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

module.exports = router;
