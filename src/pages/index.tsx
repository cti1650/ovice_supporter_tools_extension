import React from 'react'
import { WideLayout } from '@components/Layout'
import { PlaceStatus, PrivateStatus } from '@components/Status'
import { useTabState } from '@components/Recoil'
import {
    VolumeControllButton,
    MicControllButton,
    ScreenShareControllButton,
    RestControllButton,
    LeaveControllButton,
    MoveFrontControllButton,
} from '@components/Button'
import { TabTitleStatus } from '@components/Status/TabTitleStatus'
import { useOvice } from 'src/hooks/useOvice'

const Pages = () => {
    // const { tabId } = useTabState()
    const { data } = useOvice()
    return (
        <>
            <WideLayout
                title={'oVice Supporter Tools Extension'}
                classNames={{ root: 'relative' }}
            >
                {data &&
                    data.map((item, index) => {
                        return (
                            <div
                                className='flex items-center space-x-[19px] pb-2'
                                key={item.tabId}
                            >
                                <div className='flex flex-row items-end space-x-[19px]'>
                                    <MicControllButton
                                        shape='square'
                                        size='medium'
                                        data={item}
                                    />
                                    <MoveFrontControllButton
                                        shape='square'
                                        size='small'
                                        data={item}
                                    />
                                    <LeaveControllButton
                                        shape='square'
                                        size='small'
                                        data={item}
                                    />
                                </div>
                                <div className='h-full w-full'>
                                    <div className='my-auto'>{item.title}</div>
                                </div>
                            </div>
                        )
                    })}
            </WideLayout>
        </>
    )
}

export default Pages
