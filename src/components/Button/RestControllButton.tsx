import { CoffeeIcon } from '@components/Icon'
import { useTabState } from '@components/Recoil'
import { IconOptionButtonProps } from '@components/Type'
import { useCallback, useMemo, VFC } from 'react'
import { IconButton } from './IconButton'

export const RestControllButton: VFC<IconOptionButtonProps> = ({
    shape,
    size,
    data,
}) => {
    const handleClick = useCallback(() => {
        if (!chrome?.runtime) {
            return
        }
        chrome?.runtime.sendMessage('action_rest', () => {
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
                tips='Rest'
                title='rest'
                size={size ?? 'medium'}
                shape={shape}
                disabled={!data?.hasRest}
                OnIcon={<CoffeeIcon />}
                onClick={handleClick}
            />
        ),
        [data, handleClick]
    )
}
