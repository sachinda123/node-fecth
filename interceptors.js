const requestInterceptors = [];
const responseInterceptors = [];

function addRequestInterceptor(interceptor) {
  requestInterceptors.push(interceptor);
}

function addResponseInterceptor(interceptor) {
  responseInterceptors.push(interceptor);
}

async function applyRequestInterceptors(config) {
  for (const interceptor of requestInterceptors) {
    config = await interceptor(config);
  }
  return config;
}

async function applyResponseInterceptors(response) {
  for (const interceptor of responseInterceptors) {
    response = await interceptor(response);
  }
  return response;
}

module.exports = {
  addRequestInterceptor,
  addResponseInterceptor,
  applyRequestInterceptors,
  applyResponseInterceptors,
};
