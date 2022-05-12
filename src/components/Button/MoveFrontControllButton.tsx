import { FocusIcon, LogoutIcon } from '@components/Icon'
import { useTabState } from '@components/Recoil'
import { IconOptionButtonProps } from '@components/Type'
import { useCallback, useMemo, VFC } from 'react'
import { IconButton } from './IconButton'

export const MoveFrontControllButton: VFC<IconOptionButtonProps> = ({
    shape,
    size,
    data,
}) => {
    const handleClick = useCallback(() => {
        if (!chrome?.runtime) {
            return
        }
        chrome.tabs.update(Number(data.tabId), { selected: true }, function () {
            chrome.windows.update(data.windowId, { focused: true })
        })
    }, [data])
    return useMemo(
        () => (
            <IconButton
                tips='To The Front'
                title='front'
                size={size ?? 'medium'}
                shape={shape}
                disabled={data?.placeType === 'none'}
                OnIcon={<FocusIcon />}
                onClick={handleClick}
            />
        ),
        [data, handleClick]
    )
}
