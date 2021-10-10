import Vue from "vue";
import router from "@/router";

export function requestUrl(url, method, Splicing, params) {
  if (typeof url == "undefined") {
    console.log("typeof url == undefined");
    return;
  }
  if (typeof Splicing != "undefined") {
    url = url + Splicing;
  }
  if (typeof method != "undefined" && method == "post") {
    url = url + "/";
  }
  var result = url;
  if (typeof params != "undefined") {
    if (Object.keys(params).length > 0) {
      url = url + "?";
      for (var key in params) {
        var item = params[key];
        url = url + key + "=" + item + "&";
      }
      result = url.slice(0, -1);
    }
  }
  console.log(result);
  return result;
}

export function request(url, method, params) {
  if (typeof url == "undefined") {
    console.log("typeof url == undefined");
    return;
  }
  return new Promise((resolve, reject) => {
    Vue.http[method](url, {
      params: params,
    })
      .then((res) => {
        console.log("request", res);
        var data = res.data;
        var code = typeof data.code == "undefined" ? res.status : data.code;
        if (code == 200 || code == 0) {
          console.log(url + "成功了", data);
          resolve(data);
        } else {
          console.log(url + "出错了", data);
          reject(data);
        }
      })
      .catch((err) => {
        var data = err.data;
        // 统一处理异常情况
        if (data.code == 500) {
          // 跳转注册页
          router.push("/");
        }
      });
  });
}
