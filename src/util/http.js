import axios from "axios";
import {store,} from "../redux/store";
// axios.defaults.baseURL=""
axios.defaults.baseURL="//82.157.40.116:3000"
// axios.defaults.baseURL="https://json.sgray.top/jsonapi"

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  store.dispatch({
    type:"change-loading",
    payload:true
  })
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  store.dispatch({
    type:"change-loading",
    payload:false
  })
  
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  store.dispatch({
    type:"change-loading",
    payload:false
  })
  return Promise.reject(error);
});