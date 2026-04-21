import axios from "axios";
import errorCode from "@/utils/errorCode";
// 导入状态管理
import store from '@/store'
import { tansParams } from "@/utils/index";
import cache from "@/plugins/cache";
import { Notify, Toast, Dialog } from "vant";

// 是否显示重新登录
export let isRelogin = {
    show: false,
};

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: "https://zzl.open.etong.cc",
    // baseURL: process.env.VUE_APP_BASE_API,
    // 超时
    timeout: 10000,
});

// request拦截器
service.interceptors.request.use(
    (config) => {
        config.headers = config.headers || {};
        // 是否需要设置 token
        const isToken = (config.headers || {}).isToken === false;
        // 是否需要防止数据重复提交
        const isRepeatSubmit = (config.headers || {}).repeatSubmit === false;
        const token = store.getters.token
        if (token && !isToken) {
            config.headers["Authorization"] = "Bearer " + token; // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        // get请求映射params参数
        if (config.method === "get" && config.params) {
            let url = config.url + "?" + tansParams(config.params);
            url = url.slice(0, -1);
            config.params = {};
            config.url = url;
        }
        if (
            !isRepeatSubmit &&
            (config.method === "post" || config.method === "put")
        ) {
            const requestObj = {
                url: config.url,
                data:
                    typeof config.data === "object"
                        ? JSON.stringify(config.data)
                        : config.data,
                time: new Date().getTime(),
            };
            const sessionObj = cache.session.getJSON("sessionObj");
            if (
                sessionObj === undefined ||
                sessionObj === null ||
                sessionObj === ""
            ) {
                cache.session.setJSON("sessionObj", requestObj);
            } else {
                const s_url = sessionObj.url; // 请求地址
                const s_data = sessionObj.data; // 请求数据
                const s_time = sessionObj.time; // 请求时间
                const interval = 1000; // 间隔时间(ms)，小于此时间视为重复提交
                if (
                    s_data === requestObj.data &&
                    requestObj.time - s_time < interval &&
                    s_url === requestObj.url
                ) {
                    const message = "数据正在处理，请勿重复提交";
                    Toast.fail(message);
                    return Promise.reject(new Error(message));
                } else {
                    cache.session.setJSON("sessionObj", requestObj);
                }
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    (res) => {
        // 未设置状态码则默认成功状态
        const code =
            res.data && res.data.code !== undefined && res.data.code !== null
                ? Number(res.data.code)
                : 200;
        // 获取错误信息
        const msg = errorCode[code] || res.data.msg || errorCode["default"];
        // 二进制数据则直接返回
        if (
            res.request.responseType === "blob" ||
            res.request.responseType === "arraybuffer"
        ) {
            return res.data;
        }
        if (code === 401) {
            if (!isRelogin.show) {
                isRelogin.show = true;
                Dialog.confirm({
                    title: "系统提示",
                    message: "登录状态已过期，您可以继续留在该页面，或者重新登录。",
                    confirmButtonText: "重新登录",
                    cancelButtonText: "取消",
                })
                    .then(() => {
                        isRelogin.show = false;
                        store.dispatch('LogOut').then(() => {
                            location.href = '/';
                        })
                    })
                    .catch(() => {
                        isRelogin.show = false;
                    });
            }
            return Promise.reject(new Error("无效的会话，或者会话已过期，请重新登录。"));
        } else if (code === 500) {
            Toast.fail(msg);
            return Promise.reject(new Error(msg));
        } else if (code !== 200) {
            Notify({
                type: "danger",
                message: msg,
            });
            return Promise.reject(new Error(msg));
        } else {
            return res.data;
        }
    },
    (error) => {
        if (axios.isCancel && axios.isCancel(error)) {
            return Promise.reject(error);
        }
        let message =
            (error.response && error.response.data && (error.response.data.msg || error.response.data.message)) ||
            error.message ||
            errorCode["default"];
        if (message == "Network Error") {
            message = "后端接口连接异常";
        } else if (message.includes("timeout")) {
            message = "系统接口请求超时";
        } else if (message.includes("Request failed with status code")) {
            message = "系统接口" + message.substr(message.length - 3) + "异常";
        }
        Toast.fail(message);
        return Promise.reject(error);
    }
);

export default service;
