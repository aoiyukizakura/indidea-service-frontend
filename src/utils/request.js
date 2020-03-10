import axios from 'axios';

const token = localStorage.getItem("admin_token");

const service = axios.create({
    
    timeout: 5000
});

service.interceptors.request.use(
    config => {
        config.headers = Object.assign(
            {
              Accept: "application/json",
              "Content-Type": "application/json; charset=UTF-8" //  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            config.headers
          );
          if (token) {
            config.headers["token"] = token;
          }
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

export default service;
