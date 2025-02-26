const redirectToDashboard = (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
};

module.exports = { redirectToDashboard };
