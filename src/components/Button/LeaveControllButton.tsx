import { LogoutIcon } from '@components/Icon'
import { useTabState } from '@components/Recoil'
import { IconOptionButtonProps } from '@components/Type'
import { useCallback, useMemo, VFC } from 'react'
import { IconButton } from './IconButton'

export const LeaveControllButton: VFC<IconOptionButtonProps> = ({
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
    return useMemo(
        () => (
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
        ),
        [data, handleClick]
    )
}
