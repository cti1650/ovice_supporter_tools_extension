import { OffVolumeIcon, OnVolumeIcon } from '@components/Icon'
import { useTabState } from '@components/Recoil'
import { IconOptionButtonProps } from '@components/Type'
import { useCallback, useMemo, VFC } from 'react'
import { IconButton } from './IconButton'

export const VolumeControllButton: VFC<IconOptionButtonProps> = ({
    shape,
    size,
    data,
}) => {
    const handleClick = useCallback(() => {
        if (!chrome?.runtime) {
            return
        }
        chrome?.runtime.sendMessage('action_volume_change', () => {
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
                tips='Operate The Volume'
                title='volume'
                size={size ?? 'large'}
                shape={shape}
                on={data?.volumeState}
                disabled={!data?.hasMic}
                OnIcon={<OnVolumeIcon />}
                OffIcon={<OffVolumeIcon />}
                onClick={handleClick}
            />
        ),
        [data, handleClick]
    )
}
