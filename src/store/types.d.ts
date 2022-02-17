import { PyGridTypes, PyPoppyTypes, PyRootStateTypes } from "@/framework/store/types";

export interface RootStateTypes extends PyRootStateTypes {
    text: string,
    loading: boolean,
    navActive: boolean,
    sidebarActive: boolean,
    prefix: string,
    navs: object,
    size: string,
    nav: object,
    sidebars: object
}


export interface ThemeTypes {
    size: string,
}

export interface NavTypes {
    menus: object,
    navs: object,
    key: string,
    prefix: string,
}

export interface AllStateTypes extends RootStateTypes, PyRootStateTypes {
    poppy: PyPoppyTypes,
    theme: ThemeTypes,
    grid: PyGridTypes,
    nav: NavTypes,
}


