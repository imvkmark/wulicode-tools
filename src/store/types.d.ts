export interface PyRootStateTypes {
    loading: boolean,
}


export interface PyPoppyTypes {
    user: object,
    appId: string,
    core: object,
    token: string,
    size: string,
    loading: object,
    action: PyPoppyAction,
    media: string,
    style: string,
    title: string,
}

export interface PyPoppyAction {
    method?: string,       // page, request
    params?: object,       // 附加的参数对象, 用于批量请求
    url?: string,
    title?: string,
    type?: string,         // form
    confirm?: boolean,     // false
}


export interface PyNavTypes {
    menus: [],
    navs: object,
    key: string,
    prefix: string,
    sidebarActive: boolean,
}
