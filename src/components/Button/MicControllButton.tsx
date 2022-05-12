import { OffMicIcon, OnMicIcon } from '@components/Icon'
import { useTabState } from '@components/Recoil'
import { IconOptionButtonProps } from '@components/Type'
import { data } from 'autoprefixer'
import { useCallback, useMemo, VFC } from 'react'
import { IconButton } from './IconButton'

export const MicControllButton: VFC<IconOptionButtonProps> = ({
    shape,
    size,
    data,
}) => {
    const handleClick = useCallback(() => {
        if (!chrome?.runtime) {
            return
        }
        chrome.scripting.executeScript({
            target: { tabId: data?.tabId },
            files: ['js/oviceConnecter.js', 'js/micChange.js'],
        })
    }, [data])
    return useMemo(
        () => (
            <IconButton
                tips='Operate The Mic'
                title='mic'
                size={size ?? 'large'}
                shape={shape}
                on={data?.micState}
                disabled={!data?.hasMic}
                OnIcon={<OnMicIcon />}
                OffIcon={<OffMicIcon />}
                onClick={handleClick}
            />
        ),
        [data, handleClick]
    )
}
