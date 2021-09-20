export interface RootStateTypes {
    text: string
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


