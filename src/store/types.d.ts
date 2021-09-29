export interface RootStateTypes {
    text: string,
    loading: boolean
}

export interface PoppyTypes {
    is401: boolean,
    appId: string,
    core: object,
    token: string,
}

export interface AllStateTypes extends RootStateTypes {
    poppy: PoppyTypes
}


