export type IconButtonClassNamesType = {
    root?: string
    button?: string
    label?: string
}

export type IconButtonProps = {
    OnIcon?: React.ReactNode
    OffIcon?: React.ReactNode
    on?: boolean | undefined
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    size?: 'small' | 'medium' | 'large' | undefined
    shape?: 'circle' | 'square' | undefined
    title?: string
    tips?: string
    disabled?: boolean
    classNames?: IconButtonClassNamesType
}

export type IconOptionButtonProps = {
    size?: 'small' | 'medium' | 'large' | undefined
    shape?: 'circle' | 'square' | undefined
    data?: any
}

export type TabState = {
    tabId: number
    tabTitle?: string
    place?: string
    placeType?: string
    hasLogout?: boolean | undefined
    hasOpenSpace?: boolean | undefined
    hasCoffee?: boolean | undefined
    hasScreenShare?: boolean | undefined
    hasMic?: boolean | undefined
    screenShareOn?: boolean | undefined
    micOn?: boolean | undefined
    volumeOn?: boolean | undefined
}
