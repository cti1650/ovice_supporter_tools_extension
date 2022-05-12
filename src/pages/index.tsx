import React, { useEffect, useMemo, useState } from 'react'
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
import { BlankPanel, Panel } from '@components/Panel'

const Pages = () => {
    const { data } = useOvice()
    console.log(data)
    return useMemo(
        () => (
            <>
                <WideLayout
                    title={'oVice Supporter Tools Extension'}
                    classNames={{ root: 'relative' }}
                >
                    {data?.length === 0 && <BlankPanel />}
                    {data &&
                        data.map((item, index) => {
                            return <Panel key={index} data={item} />
                        })}
                </WideLayout>
            </>
        ),
        [data]
    )
}

export default Pages
