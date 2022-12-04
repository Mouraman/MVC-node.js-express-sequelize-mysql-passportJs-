let exportations = (module.exports = {});
exportations.signup = function (req, res) {
  res.render("signup");
};
exportations.signin = function (req, res) {
  res.render("signin");
};
exportations.dashboard = function (req, res) {
  res.render("dashboard");
};
exportations.logout = function (req, res) {
  req.session.destroy(function (err) {
    res.redirect("/");
  });
};
