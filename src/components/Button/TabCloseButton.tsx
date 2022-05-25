import { LogoutIcon } from '@components/Icon'
import { WindowCloseIcon } from '@components/Icon/WindowCloseIcon'
import { useTabState } from '@components/Recoil'
import { IconOptionButtonProps } from '@components/Type'
import { useCallback, useMemo, VFC } from 'react'
import { IconButton } from './IconButton'

export const TabCloseButton: VFC<IconOptionButtonProps> = ({
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
            files: ['js/oviceConnecter.js', 'js/actionLeave.js'],
        })
    }, [data])
    const handleTabClose = useCallback(() => {
        if (!chrome?.runtime) {
            return
        }
        chrome.tabs.remove(data?.tabId)
    }, [data])
    return useMemo(() => {
        return data?.placeType === 'room' ? (
            <IconButton
                tips={
                    data?.placeType === 'room'
                        ? 'Leave The Room'
                        : 'Leave The oVice'
                }
                title='leave'
                size={size ?? 'medium'}
                shape={shape}
                disabled={!data?.hasLeave}
                OnIcon={<LogoutIcon />}
                onClick={handleClick}
            />
        ) : (
            <IconButton
                tips='close'
                title='close'
                size={size ?? 'medium'}
                shape={shape}
                disabled={!data?.hasLeave}
                OnIcon={<WindowCloseIcon />}
                onClick={handleTabClose}
            />
        )
    }, [data, handleClick])
}
