import { ScreenIcon } from '@components/Icon'
import { useTabState } from '@components/Recoil'
import { IconOptionButtonProps } from '@components/Type'
import { useCallback, useMemo, VFC } from 'react'
import { IconButton } from './IconButton'

export const ScreenShareControllButton: VFC<IconOptionButtonProps> = ({
    shape,
    size,
    data,
}) => {
    const handleClick = useCallback(() => {
        if (!chrome?.runtime) {
            return
        }
        chrome?.runtime.sendMessage('action_screenshare_change', () => {
            if (chrome.runtime.lastError) {
                // console.error('error:', chrome.runtime.lastError.message)
                return
            }
            // console.log('test')
        })
    }, [])
    return useMemo(
        () => (
            <IconButton
                tips='Operate The Screen Share'
                title='screen'
                size={size ?? 'large'}
                shape={shape}
                on={data?.screenshareState}
                disabled={!data?.hasScreenshare}
                OnIcon={<ScreenIcon />}
                onClick={handleClick}
            />
        ),
        [data, handleClick]
    )
}
