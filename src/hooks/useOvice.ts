import { useCallback, useEffect, useMemo, useState } from 'react'

const defaultData = [
    {
        hasCoffee: true,
        hasLeave: false,
        hasLogout: false,
        hasMic: true,
        hasOpenSpace: false,
        hasScreenshare: true,
        micState: false,
        newChatMessageCount: 0,
        placeType: 'openspace',
        screenshareState: false,
        tabId: 5795,
        title: 'oVice-beta-200 space',
        url: 'https://beta.ovice.in/@210,126',
        userName: 'anonymous',
        windowId: 91,
    },
    {
        hasCoffee: true,
        hasLeave: false,
        hasLogout: false,
        hasMic: true,
        hasOpenSpace: false,
        hasScreenshare: true,
        micState: true,
        newChatMessageCount: 0,
        placeType: 'openspace',
        screenshareState: false,
        tabId: 5794,
        title: 'oVice-beta-200 space',
        url: 'https://beta.ovice.in/@210,126',
        userName: 'anonymous',
        windowId: 91,
    },
]

export const useOvice = () => {
    const [data, setData] = useState<any[]>()
    const getStatus = useCallback(async () => {
        if (!chrome?.storage?.local) {
            return
        }
        chrome.storage.local.get(['ovice_tabs_data'], async (storageData) => {
            const newData = storageData.ovice_tabs_data
            if (data?.length !== newData?.length) {
                console.log(newData)
                setData(newData)
            } else {
                const isEqual = data.every((item, index) => {
                    return Object.keys(item).every((key) => {
                        return item[key] === newData[index][key]
                    })
                })
                if (!isEqual) {
                    console.log(newData)
                    setData(newData)
                }
            }
        })
    }, [data, setData])

    useEffect(() => {
        if (!chrome?.storage?.local) {
            setData(defaultData)
        }
    }, [])

    useEffect(() => {
        getStatus()
        const tick = setInterval(() => {
            getStatus()
        }, 300)
        return () => {
            clearInterval(tick)
        }
    }, [getStatus])

    return useMemo(() => {
        return {
            data,
        }
    }, [data])
}
