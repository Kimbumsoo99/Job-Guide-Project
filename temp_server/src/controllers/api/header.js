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

const callAPI = (url, method, data, sessionId) => {
    return new Promise((resolve, reject) => {
        // const options = getOptions(sessionId);

        // options.hostname = hostIP;
        // options.path = url;
        // options.port = 443;
        // options.method = method;

        const apiReq = https.request(options, (apiRes) => {
            console.log(`statusCode: ${apiRes.statusCode}`);

            let responseData = "";

            apiRes.on("data", (d) => {
                responseData += d;
            });

            apiRes.on("end", () => {
                resolve(responseData);
            });
        });

        apiReq.on("error", (error) => {
            reject(error);
        });

        apiReq.write(data);
        apiReq.end();
        console.log("요청 성공");
    });
};
