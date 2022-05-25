import {
    LeaveControllButton,
    MicControllButton,
    MoveFrontControllButton,
} from '@components/Button'
import { TabCloseButton } from '@components/Button/TabCloseButton'
import { useMemo } from 'react'

export const Panel = ({ data }) => {
    console.log(data)
    return useMemo(
        () => (
            <div className='flex items-center space-x-[19px] pb-2'>
                <div className='flex flex-row items-end space-x-[19px]'>
                    <MicControllButton
                        shape='square'
                        size='medium'
                        data={data}
                    />
                    <MoveFrontControllButton
                        shape='square'
                        size='small'
                        data={data}
                    />
                    <TabCloseButton shape='square' size='small' data={data} />
                </div>
                <div className='h-full w-full'>
                    <div className='my-auto'>
                        {data?.title}{' '}
                        {!!data?.newChatMessageCount &&
                            `(${data?.newChatMessageCount})`}
                        {data?.openChatBox && '💬'}
                    </div>
                </div>
            </div>
        ),
        [data]
    )
}
