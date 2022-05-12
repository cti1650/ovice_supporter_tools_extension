import { useCallback, useEffect, useMemo, useState } from 'react'

export const useOvice = () => {
    const [data, setData] = useState<any[]>()

    const getStatus = useCallback(async () => {
        chrome.storage.local.get(['ovice_tabs_data'], (data) => {
            setData(data.ovice_tabs_data)
        })
    }, [])

    useEffect(() => {
        getStatus()
        const tick = setInterval(() => {
            getStatus()
        }, 200)
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
