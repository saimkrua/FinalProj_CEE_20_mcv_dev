const dotenv = require("dotenv");
dotenv.config();
const https = require("https");
const url = require("url");
const querystring = require("querystring");

const redirect_uri = `http://${process.env.backendIPAddress}/courseville/access_token`;
const authorization_url = `https://www.mycourseville.com/api/oauth/authorize?response_type=code&client_id=${process.env.client_id}&redirect_uri=${redirect_uri}`;
const access_token_url = "https://www.mycourseville.com/api/oauth/access_token";

exports.authApp = (req, res) => {
    res.redirect(authorization_url);
};

exports.accessToken = (req, res) => {
    const parsedUrl = url.parse(req.url);
    const parsedQuery = querystring.parse(parsedUrl.query);

    if (parsedQuery.error) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end(`Authorization error: ${parsedQuery.error_description}`);
        return;
    }

    if (parsedQuery.code) {
        const postData = querystring.stringify({
            grant_type: "authorization_code",
            code: parsedQuery.code,
            client_id: process.env.client_id,
            client_secret: process.env.client_secret,
            redirect_uri: redirect_uri,
        });

        const tokenOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": postData.length,
            },
        };

        const tokenReq = https.request(
            access_token_url,
            tokenOptions,
            (tokenRes) => {
                let tokenData = "";
                tokenRes.on("data", (chunk) => {
                    tokenData += chunk;
                });
                tokenRes.on("end", () => {
                    const token = JSON.parse(tokenData);
                    req.session.token = token;
                    console.log(req.session);
                    if (token) {
                        res.writeHead(302, {
                            Location: `http://${process.env.frontendIPAddress}`,
                        });                      
                        res.end();
                    }
                });
            }
        );
        tokenReq.on("error", (err) => {
            console.error(err);
        });
        tokenReq.write(postData);
        tokenReq.end();
    } else {
        res.writeHead(302, { Location: authorization_url });
        res.end();
    }
};

// Send "GET" request to CV endpoint to get user profile information
exports.getProfileInformation = (req, res) => {
    try {
        const profileOptions = {
            headers: {
                Authorization: `Bearer ${req.session.token.access_token}`,
            },
        };
        const profileReq = https.request(
            "https://www.mycourseville.com/api/v1/public/get/user/info", profileOptions,
            (profileRes) => {
                let profileData = "";
                profileRes.on("data", (chunk) => {
                    profileData += chunk;
                });
                profileRes.on("end", () => {
                    const profile = JSON.parse(profileData);
                    res.send(profile.data);
                    res.end();
                });
            }
        );
        profileReq.on("error", (err) => {
            console.error(err);
        });
        profileReq.end();
    } catch (error) {
        console.log(error);
        console.log("Please logout, then login again.");
    }
};

// Send "GET" request to CV endpoint to all course
exports.getAllCourse = (req, res) => {
    try {
        const courseOptions = {
            headers: {
                Authorization: `Bearer ${req.session.token.access_token}`,
            },
        };
        const courseReq = https.request(
            "https://www.mycourseville.com/api/v1/public/get/user/courses?detail=1", courseOptions,
            (courseRes) => {
                let courseData = "";
                courseRes.on("data", (chunk) => {
                    courseData += chunk;
                });
                courseRes.on("end", () => {
                    const data = JSON.parse(courseData);
                    res.send(data.data);
                    res.end();
                });
            }
        );
        courseReq.on("error", (err) => {
            console.error(err);
        });
        courseReq.end();
    } catch (error) {
        console.log(error);
        console.log("Please logout, then login again.");
    }
};

exports.logout = (req, res) => {
    req.session.destroy();

    res.redirect(`https://www.mycourseville.com/api/logout`);

    res.end();
};
