import User from "../models/User";
import bcrypt from "bcrypt";

export const getLogin = (req, res) => res.render("login");
export const postLogin = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).render("login", {
            errorMessage: "Please check your input again.",
        });
    }

    // 비번 확인
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(400).render("login", {
            errorMessage: "Please check your input again.",
        });
    }

    req.session.loggedIn = true;
    req.session.user = user;

    return res.redirect("/");
};

export const getJoin = (req, res) => res.render("join");

export const postJoin = async (req, res) => {
    const { name, email, username, password, password2 } = req.body;
    if (password !== password2) {
        return res.status(400).render("join", {
            errorMessage: "The password is not the same.",
        });
    }
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
        return res.status(400).render("join", {
            errorMessage: "This account is already exists.",
        });
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
        return res.status(400).render("join", {
            errorMessage: "Error occurred. Please run it again later",
        });
    }
};

export const getLogout = (req, res) => {
    req.session.user = null;
    res.locals.loggedInUser = req.session.user;
    req.session.loggedIn = false;
    return res.redirect("/");
};
