export const profile = (req, res) => {
  return res.render("profile", { pageTitle: "Profile" });
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};

export const postLogin = (req, res) => {
  req.session.loggedIn = true;
  req.session.user = "김범수";
  return res.redirect("/");
};

export const logout = (req, res) => {
  req.session.loggedIn = false;
  req.session.user = null;
  return res.redirect("/");
};
