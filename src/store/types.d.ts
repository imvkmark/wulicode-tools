export interface RootStateTypes {
    text: string,
    loading: boolean
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


