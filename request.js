const http = require("http");
const https = require("https");
const { URL } = require("url");
const { applyRequestInterceptors, applyResponseInterceptors } = require("./interceptors");

function request(config) {
  return new Promise(async (resolve, reject) => {
    config = await applyRequestInterceptors(config);
    const url = new URL(config.url);
    const options = {
      method: config.method,
      headers: config.headers,
    };

    const client = url.protocol === "https:" ? https : http;
    const req = client.request(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", async () => {
        let response = {
          status: res.statusCode,
          headers: res.headers,
          data: data,
        };
        response = await applyResponseInterceptors(response);
        resolve(response);
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (config.body) {
      req.write(config.body);
    }

    req.end();
  });
}

module.exports = request;
