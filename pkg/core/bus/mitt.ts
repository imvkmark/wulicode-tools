import mitt from 'mitt'

export const emitter = mitt();

export const PY_USER_LOGIN = 'user:login'
export const PY_USER_LOGOUT = 'user:logout'


//region 请求事件定义
export const REQUEST_LOADED = 'request:loaded'
export const REQUEST_LOADING = 'request:loading'
export const REQUEST_500 = 'request:500'
export const REQUEST_401 = 'request:401'
export const REQUEST_404 = 'request:404'
export const REQUEST_413 = 'request:413'
export const REQUEST_EXCEPTION = 'request:exception'
//endregion
