import { useCallback, useMemo, VFC } from 'react'
import cc from 'classcat'
import { IconButtonProps } from '@components/Type'

export const IconButton: VFC<IconButtonProps> = ({
    OnIcon,
    OffIcon,
    on,
    onClick,
    size,
    shape,
    title,
    tips,
    disabled,
    classNames,
}) => {
    const handleClick = useCallback(
        (event) => {
            if (onClick) onClick(event)
        },
        [onClick]
    )
    return useMemo(() => {
        return (
            <>
                <div
                    className={cc([
                        'flex flex-col justify-center items-center',
                        classNames?.root,
                    ])}
                >
                    <button
                        onClick={handleClick}
                        disabled={disabled}
                        title={tips}
                        className={cc([
                            'flex justify-center items-center bg-[#F6F6F6] shadow border border-[#E6E6E6]',
                            {
                                'rounded-xl w-[90px] h-[60px] text-[30px]':
                                    size === 'large' && shape === 'square',
                                'rounded-xl w-[50px] h-[23px] text-[13px]':
                                    size === 'small' && shape === 'square',
                                'rounded-xl w-[60px] h-[33px] text-[18px]':
                                    size !== 'large' &&
                                    size !== 'small' &&
                                    shape === 'square',
                                'rounded-full w-[60px] h-[60px] text-[30px]':
                                    size === 'large' && shape !== 'square',
                                'rounded-full w-[30px] h-[30px] text-[13px]':
                                    size === 'small' && shape !== 'square',
                                'rounded-full w-[40px] h-[40px] text-[18px]':
                                    size !== 'large' &&
                                    size !== 'small' &&
                                    shape !== 'square',
                            },
                            {
                                'text-[#E4E4E4] active:bg-[#F6F6F6]': disabled,
                                'text-[#91C699] active:bg-[#DFDFDF] hover:bg-[#EEEEEE]':
                                    on === true && !disabled,
                                'text-[#E3342F] active:bg-[#DFDFDF] hover:bg-[#EEEEEE]':
                                    on === false && !disabled,
                                'text-black active:bg-[#DFDFDF] hover:bg-[#EEEEEE]':
                                    on === undefined && !disabled,
                            },
                            classNames?.button,
                        ])}
                    >
                        {on ? OnIcon : OffIcon || OnIcon}
                    </button>
                    {title && (
                        <label
                            className={cc([
                                'flex text-center mt-[2px] text-[#B8B8B8] text-[10px]',
                                classNames?.label,
                            ])}
                        >
                            {title}
                        </label>
                    )}
                </div>
            </>
        )
    }, [on, disabled, OnIcon, OffIcon, onClick, size, title])
}
