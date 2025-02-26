const express = require("express");
const {
  getUserRepos,
  getRepoMetrics,
} = require("../controllers/repoController");
const { ensureAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.get("/repos", ensureAuthenticated, getUserRepos);
router.get("/repos/:owner/:repo/metrics", ensureAuthenticated, getRepoMetrics);

module.exports = router;
