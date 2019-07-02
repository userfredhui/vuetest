import axios from 'axios';
import { Notification } from 'element-ui';
const { NODE_ENV } = process.env;
let api = '';
if (NODE_ENV === 'production') {
  api = '/api'; // 用nginx匹配/api开头的代理
}
var instance = axios.create({
  baseURL: api,
  validateStatus(status) {
    return status;
  },
});

// 添加响应拦截器
instance.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    if (response.data && response.data.code !== '0' && response.data.message) {
      Notification({
        type: 'error',
        message: response.data.message,
      });
    }
    return response && response.data;
  },
  function(error) {
    // 对响应错误做点什么
    /* 加入登录失效或没有登录的跳转到登录页面的拦截 */
    const loginFailErrorStr = 'Network Error';
    if (error.toString().includes(loginFailErrorStr)) {
      const location = window.location;
      const jumpToUrl =
        location.origin +
        location.pathname +
        '#/?redirecturl=' +
        encodeURIComponent(location.hash.substring(1));
      window.location.href = jumpToUrl;
    }
    return Promise.reject(error);
  }
);

function request(...params) {
  return instance(params);
}

request.post = (url, postData, config = {}, isFormData = false) => {
  if (isFormData) {
    return instance.post(url, postData, {
      ...config,
      transformRequest: [
        function(data) {
          let formatStr = '';
          const keys = Object.keys(data);
          keys.forEach((key, index) => {
            formatStr += key + '=' + data[key] + (index === keys.length - 1 ? '' : '&');
          });
          return formatStr;
        },
      ],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  } else {
    return instance.post(url, postData, config);
  }
};

request.get = (url, params) => {
  return instance.get(url, params);
};

request.delete = (url, params) => {
  return instance.delete(url, params);
};

request.put = (url, postData, config = {}, isFormData = false) => {
  if (isFormData) {
    return instance.put(url, postData, {
      ...config,
      transformRequest: [
        function(data) {
          let formatStr = '';
          const keys = Object.keys(data);
          keys.forEach((key, index) => {
            formatStr += key + '=' + data[key] + (index === keys.length - 1 ? '' : '&');
          });
          return formatStr;
        },
      ],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  } else {
    return instance.put(url, postData, config);
  }
};
export default request;
