import "dotenv/config";
import User from "../models/User";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

export const getLogin = (req, res) => res.render("login");
export const postLogin = async (req, res) => {
    const { username, password } = req.body; //유저 정보 받기

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
    req.session.sessionID = null;
    req.session.token = null;
    res.locals.loggedInUser = req.session.user;
    req.session.loggedIn = false;
    return res.redirect("/");
};

const sendMail = (receiveEmail, vm) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.naver.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_ID,
            // 보내는 이메일 주소
            pass: process.env.MAIL_PW, // 네이버 암호
        },
    });

    const mailOptions = {
        from: process.env.MAIL_ID + "@naver.com",
        // 보내는 이메일 주소
        to: receiveEmail,
        // 수신자 이메일 주소
        subject: "WatchDog 서버 모니터링 알림 - CPU 사용율 위험",
        html: `
<!DOCTYPE html><html><head><meta charset="UTF-8"><title>이메일 템플릿</title><style>.wrapper {
                padding: 20px 16px 82px;
                color: #191919;
                font-family: "Noto Sans KR", sans-serif;
                max-width: 600px;
                margin: 0 auto;
            }
            .container {
                padding: 32px;
                text-align: left;
                border-top: 3px solid #22b4e6;
                border-collapse: collapse;
            }
            .content {
                padding: 20px 20px;
                border-radius: 4px;
                text-align: center;
            }
            .footer {
                padding-top: 24px;
                border-top: 1px solid #e9e9e9;
                text-align: center;
            }</style></head><body><table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#F4F5F7" class="wrapper" style="background-color: aliceblue"><tr><td><img width="92" src="https://github.com/Kimbumsoo99/PrivateCloud-in-vSphere/blob/main/server/uploads/logo.png?raw=true" alt="로고" style="width: 200px"><h1 style="font-size: 20px;
                            font-weight: 900;
                            padding-bottom: 32px;">WatchDog 서버 모니터링 알림 - CPU 사용률 위험</h1></td></tr><tr><td><table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#FFFFFF" class="container"><tr><td></td></tr><tr><td></td></tr><tr><td><table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#F8F9FA" class="content"><tr><td><h2 style="font-size: 32px;
                                                    font-weight: bold;
                                                    padding-bottom: 16px;">최근 ${vm} CPU 부하 <br> 80% 이상 지속</h2></td></tr></table></td></tr><tr><td style="padding-bottom: 24px;
                                    color: #a7a7a7;
                                    font-size: 12px;
                                    line-height: 20px;">© 2023 WatchDog.</td></tr></table></td></tr><tr><td class="footer"><img width="92" src="https://github.com/Kimbumsoo99/PrivateCloud-in-vSphere/blob/main/server/uploads/logo.png?raw=true" alt="로고"></td></tr></table></body></html>
`,
    };
    try {
        transporter.sendMail(mailOptions, function (error, info) {
            // console.log("이메일이 성공적으로 전송되었습니다: " + info.response);
            return;
        });
    } catch (error) {
        return res.render("error", {
            errorName: "Email",
            errorMsg:
                "이메일 전송과정에서 오류가 발생했습니다. 등록한 E-Mail이 맞는지 확인해주세요.",
        });
    }
};

export const getSendMail = (req, res) => {
    const { user } = req.session;
    const receiveEmail = user.email;
    const { vm } = req.query;

    try {
        sendMail(receiveEmail, vm);
    } catch (error) {
        return res.render("Email", {
            errorName: "Email",
            errorMsg:
                "이메일 전송과정에서 오류가 발생했습니다. 등록한 E-Mail이 맞는지 확인해주세요.",
        });
    }
    return res.render("mail");
};
