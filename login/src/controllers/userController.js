import { localsMiddleware } from "../middlewares";
import User from "../models/User";
import bcrypt from "bcrypt"; // 비밀번호 암호화

export const home = (req, res) => res.render("home");

export const getLogin = (req, res) => {
  return res.render("login");
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    console.log("postLogin 유저 존재 X");
    return res.status(400).render("login");
  }

  // 비번 확인
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    console.log("postLogin 비밀번호 실패");
    return res.status(400).render("login");
  }

  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
};

export const getJoin = (req, res) => {
  return res.render("join");
};

export const postJoin = async (req, res) => {
  const { name, email, username, password, password2 } = req.body;
  if (password !== password2) {
    console.log("비밀번호 오류");
    return res.status(400).render("join");
  }
  const user = await User.findOne({ $or: [{ username }, { email }] });
  console.log("유저 확인");
  console.log(user);
  if (user) {
    console.log("postJoin 유저 중복");
    return res.status(400).render("login");
  }

  try {
    await User.create({
      name,
      email,
      username,
      password,
    });
    return res.redirect("login");
  } catch (error) {
    console.log("postJoin 유저 생성 오류");
    return res.status(400).render("join");
  }
};
