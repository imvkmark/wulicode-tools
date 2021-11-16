export interface RootStateTypes {
    text: string,
    loading: boolean,
    navActive: boolean,
    prefix: string,
    navs: object,
    size: string,
    nav: object,
    sidebars: object,
}

export interface PoppyTypes {
    user: object,
    appId: string,
    core: object,
    token: string,
}

export interface AllStateTypes extends RootStateTypes {
    poppy: PoppyTypes
}


