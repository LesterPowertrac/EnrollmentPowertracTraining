import config from "./config";

const ApiUrl = window.location.hostname === "127.0.0.1" ? config.api.local : config.api.remote;


export default ApiUrl