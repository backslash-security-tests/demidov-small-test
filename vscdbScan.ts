export interface VscdbQueryResult {
    key: string
    value: string
}

export interface VscdbScanResult {
    enabledModels: string[]
    globalRule: string
}

export interface CursorVscdbConfig {
    availableDefaultModels2: {
        name: string
        defaultOn: boolean
    }[]
    aiSettings: {
        modelOverrideEnabled: string[]
        modelOverrideDisabled: string[]
    }
}