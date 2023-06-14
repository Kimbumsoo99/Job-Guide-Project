require("dotenv").config();
var nodemailer = require("nodemailer");

function abc() {
    console.log(process.env.MAIL_ID);
}
var sendMailInfo;
// Ajax 요청 보내기
function bbb() {
    var xhrMail = new XMLHttpRequest();
    xhrMail.open("GET", "/send", true);
    xhrMail.onload = function () {
        if (xhrMail.status === 200) {
            sendMailInfo = JSON.parse(xhrMail.responseText);
            // 서버에서 가져온 데이터 사용하기
        }
    };
    xhrMail.send();

    // 네이버 메일 계정 정보
    var transporter = nodemailer.createTransport({
        host: "smtp.naver.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_ID,
            // 보내는 이메일 주소
            pass: process.env.MAIL_PW, // 네이버 암호
        },
    });

    // 이메일 옵션 설정
    var mailOptions = {
        from: process.env.MAIL_ID,
        // 보내는 이메일 주소
        to: sendMailInfo.receiveEmail,
        // 수신자 이메일 주소
        subject: "WatchDog 서버 모니터링 알림 - CPU 사용율 위험",
        html: `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>이메일 템플릿</title>
        <style>
            .wrapper {
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
            }
        </style>
    </head>
    <body>
        <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="100%"
            bgcolor="#F4F5F7"
            class="wrapper"
            style="background-color: aliceblue"
        >
            <tr>
                <td>
                    <img
                        width="92"
                        src="https://github.com/Kimbumsoo99/PrivateCloud-in-vSphere/blob/main/temp_server/uploads/logo.png?raw=true"
                        alt="로고"
                        style="width: 200px"
                    />
                    <h1
                        style="
                            font-size: 20px;
                            font-weight: 900;
                            padding-bottom: 32px;
                        "
                    >
                        WatchDog 서버 모니터링 알림 - CPU 사용률 위험
                    </h1>
                </td>
            </tr>
            <tr>
                <td>
                    <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        bgcolor="#FFFFFF"
                        class="container"
                    >
                        <tr>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    width="100%"
                                    bgcolor="#F8F9FA"
                                    class="content"
                                >
                                    <tr>
                                        <td>
                                            <h2
                                                style="
                                                    font-size: 32px;
                                                    font-weight: bold;
                                                    padding-bottom: 16px;
                                                "
                                            >
                                                최근 ${sendMailInfo.vm} CPU 부하 80% 이상 지속
                                            </h2>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td
                                style="
                                    padding-bottom: 24px;
                                    color: #a7a7a7;
                                    font-size: 12px;
                                    line-height: 20px;
                                "
                            >
                                © 2023 WatchDog.
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td class="footer">
                    <img
                        width="92"
                        src="https://github.com/Kimbumsoo99/PrivateCloud-in-vSphere/blob/main/temp_server/uploads/logo.png?raw=true"
                        alt="로고"
                    />
                </td>
            </tr>
        </table>
    </body>
</html>
`,
    };

    // 이메일 전송
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("이메일이 성공적으로 전송되었습니다: " + info.response);
        }
    });
}
