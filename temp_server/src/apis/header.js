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
                const jsonResponse = JSON.parse(responseBody);
                console.log("JSON 객체 값");
                console.log(jsonResponse);
                resolve(jsonResponse);
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

/*
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
*/
