let exportations = (module.exports = {});
exportations.signup = function (req, res) {
  var message = req.flash("message");
  res.render("signup", { message });
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
