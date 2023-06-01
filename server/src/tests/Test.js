export const stopPower = async (request, response) => {
    const username = "administrator@vsphere.local";
    const password = "123Qwer!";
    const hostIP = "192.168.0.102";
    try {
        const sessionId = await getSessionId(username, password, hostIP);
        const vm = await getVMName(sessionId);
        const data = JSON.stringify({});

        const options = {
            hostname: hostIP,
            path: `/rest/vcenter/vm/${vm}/power/stop`,
            port: 443,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "vmware-api-session-id": sessionId,
            },
            rejectUnauthorized: false,
        };

        const apiReq = https.request(options, (apiRes) => {
            console.log(`statusCode: ${apiRes.statusCode}`);

            apiRes.on("data", (d) => {
                process.stdout.write(d);
            });
        });

        apiReq.on("error", (error) => {
            console.error(error);
        });

        apiReq.write(data);
        apiReq.end();
        console.log("요청 성공");
        return response.redirect("/");
    } catch (error) {
        console.error(error);
        return response.status(500).send("Error");
    }
};

export const startPower = async (request, response) => {
    const username = "administrator@vsphere.local";
    const password = "123Qwer!";
    const hostIP = "192.168.0.102";
    try {
        const sessionId = await getSessionId(username, password, hostIP);
        const vm = await getVMName(sessionId);
        const data = JSON.stringify({});

        const options = {
            hostname: hostIP,
            path: `/rest/vcenter/vm/${vm}/power/start`,
            port: 443,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "vmware-api-session-id": sessionId,
            },
            rejectUnauthorized: false,
        };

        const apiReq = https.request(options, (apiRes) => {
            console.log(`statusCode: ${apiRes.statusCode}`);

            apiRes.on("data", (d) => {
                process.stdout.write(d);
            });
        });

        apiReq.on("error", (error) => {
            console.error(error);
        });

        apiReq.write(data);
        apiReq.end();
        console.log("요청 성공");
        return response.redirect("/");
    } catch (error) {
        console.error(error);
        return response.status(500).send("Error");
    }
};
