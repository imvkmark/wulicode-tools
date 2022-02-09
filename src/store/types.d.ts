export interface RootStateTypes {
    text: string,
    loading: boolean,
    navActive: boolean,
    sidebarActive: boolean,
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


export interface ThemeTypes {
    size: string,
}

export interface GridTypes {
    action: object,
    button: string,
    page: string,
    loading: boolean,
    reload: boolean,
    reset: boolean,
}

export interface AllStateTypes extends RootStateTypes {
    poppy: PoppyTypes,
    theme: ThemeTypes,
    grid: GridTypes
}


