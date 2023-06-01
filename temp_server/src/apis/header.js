import https from "https";

export const getBaseOptions = (hostIP) => {
    return {
        hostname: hostIP,
        port: 443,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        rejectUnauthorized: false,
    };
};

export const requestAPI = async (options, data) => {
    if (!data) {
        data = JSON.stringify({});
    }

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            console.log(`statusCode: ${res.statusCode}`);
            let responseBody = "";

            res.on("data", (chunk) => {
                responseBody += chunk;
            });

            res.on("end", () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    if (responseBody) {
                        const jsonResponse = JSON.parse(responseBody);
                        console.log("JSON 객체 값");
                        // console.log(jsonResponse);
                        resolve(jsonResponse);
                    } else {
                        console.log("빈 응답");
                        resolve();
                    }
                } else {
                    console.log("요청 실패");
                    reject(
                        new Error(
                            `Request failed with status code ${res.statusCode}`
                        )
                    );
                }
            });
        });

        req.on("error", (error) => {
            console.error(error);
            reject(error);
        });

        req.write(data);
        req.end();
    });
};
