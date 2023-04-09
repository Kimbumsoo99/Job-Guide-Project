export const home = (req, res) => res.render("home");

export const getLogin = (req, res) => {
  return res.render("login");
};

export const postLogin = (req, res) => {};

export const getJoin = (req, res) => {
  return res.render("join");
};
