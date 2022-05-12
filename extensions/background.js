const testMode = false

chrome.runtime.onInstalled.addListener(() => {
    testMode && console.log('Installed')
})

const checkOviceUrl = (url) => {
    const reg = /https?:\/\/.*?\.ovice\.in\/(@room_id-\d+|@\d+,\d+)+/
    return reg.exec(url)
}

const addScript = (funcOption = {}, callback) => {
    chrome.storage.local.get(['ovice_tab_id'], (result) => {
        if (result.ovice_tab_id !== 0) {
            chrome.scripting.executeScript(
                {
                    ...funcOption,
                    target: { tabId: result.ovice_tab_id },
                },
                (injectionResults) => {
                    for (const frameResult of injectionResults) {
                        if (callback) callback(frameResult.result)
                    }
                }
            )
        }
    })
}

const polingOviceTabsStatus = () => {
    chrome.tabs.query({}, (tabs) => {
        const oviceTabs = [...tabs].filter((tab) => {
            return checkOviceUrl(tab.url)
        })
        const dataSet = oviceTabs.map(async (tab) => {
            return new Promise((resolve, reject) => {
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tab.id },
                        files: ['js/oviceConnecter.js', 'js/flagChecker.js'],
                    },
                    (injectionResults) => {
                        if (chrome.runtime.lastError) {
                            testMode &&
                                console.error(
                                    'error:',
                                    chrome.runtime.lastError.message
                                )
                            reject(null)
                            return
                        }
                        for (const frameResult of injectionResults) {
                            if (frameResult.result) {
                                resolve({
                                    tabId: tab.id,
                                    windowId: tab.windowId,
                                    ...frameResult.result,
                                })
                            }
                        }
                    }
                )
            })
        })
        Promise.all(dataSet).then((results) => {
            chrome.storage.local.set({ ovice_tabs_data: results })
        })
    })
}

let counter = 0
const tick = setInterval(() => {
    testMode && console.log('tick')
    testMode && console.log('counter', counter)
    if (counter % 20 === 0) {
        polingOviceTabsStatus()
    }
    counter++
}, 4000)

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (~tab.url.indexOf('ovice.in')) {
        if (checkOviceUrl(tab.url)) {
            testMode && console.log('changeInfo', changeInfo)
            if (changeInfo?.status === 'complete' || changeInfo?.favIconUrl) {
                polingOviceTabsStatus()
            }
        }
    }
})

chrome.tabs.onActivated.addListener((activeInfo) => {
    testMode && console.log('active Info', activeInfo)
    polingOviceTabsStatus()
})

const actionMicChange = () => {
    chrome.storage.local.get(['ovice_tab_id'], (data) => {
        chrome.scripting.executeScript(
            {
                target: { tabId: Number(data.ovice_tab_id) },
                files: ['js/oviceConnecter.js', 'js/micChange.js'],
            },
            () => {
                if (chrome.runtime.lastError) {
                    testMode &&
                        console.error(
                            'error:',
                            chrome.runtime.lastError.message
                        )
                    return
                }
                chrome.runtime.sendMessage('get_ovice_status', (res) => {
                    testMode && console.log('res', res)
                    sendResponse({})
                })
            }
        )
    })
}

const actionScreenshareChange = () => {
    chrome.storage.local.get(['ovice_tab_id'], (data) => {
        chrome.tabs.update(
            Number(data.ovice_tab_id),
            { selected: true },
            function (tab) {
                chrome.windows.update(tab.windowId, { focused: true }, () => {
                    chrome.scripting.executeScript(
                        {
                            target: { tabId: tab.id },
                            files: [
                                'js/oviceConnecter.js',
                                'js/screenShareChange.js',
                            ],
                        },
                        () => {
                            if (chrome.runtime.lastError) {
                                testMode &&
                                    console.error(
                                        'error:',
                                        chrome.runtime.lastError.message
                                    )
                                return
                            }
                            chrome.runtime.sendMessage(
                                'get_ovice_status',
                                (res) => {
                                    testMode && console.log('res', res)
                                    sendResponse({})
                                }
                            )
                        }
                    )
                })
            }
        )
    })
}

const actionMoveToOvice = () => {
    chrome.storage.local.get(['ovice_tab_id'], (data) => {
        chrome.tabs.update(
            Number(data.ovice_tab_id),
            { selected: true },
            function (tab) {
                chrome.windows.update(tab.windowId, { focused: true })
                sendResponse({})
            }
        )
    })
}

const actionVolumeChange = () => {
    chrome.storage.local.get(['ovice_tab_id', 'ovice_volume_on'], (data) => {
        testMode && console.log(Number(data.ovice_tab_id))
        testMode && console.log(data.ovice_volume_on)
        chrome.tabs.update(
            Number(data.ovice_tab_id),
            { muted: data.ovice_volume_on },
            function (tab) {
                testMode && console.log(tab)
                chrome.storage.local.set({
                    ovice_volume_on: !tab.mutedInfo.muted,
                })
            }
        )
        sendResponse({})
    })
}

const actionRest = () => {
    chrome.storage.local.get(['ovice_tab_id'], (data) => {
        chrome.tabs.update(
            Number(data.ovice_tab_id),
            { selected: true },
            function (tab) {
                chrome.windows.update(
                    tab.windowId,
                    {
                        focused: true,
                    },
                    () => {
                        chrome.scripting.executeScript(
                            {
                                target: {
                                    tabId: Number(data.ovice_tab_id),
                                },
                                files: [
                                    'js/oviceConnecter.js',
                                    'js/actionRest.js',
                                ],
                            },
                            () => {
                                if (chrome.runtime.lastError) {
                                    testMode &&
                                        console.error(
                                            'error:',
                                            chrome.runtime.lastError.message
                                        )
                                    return
                                }
                                chrome.runtime.sendMessage(
                                    'get_ovice_status',
                                    (res) => {
                                        if (chrome.runtime.lastError) {
                                            testMode &&
                                                console.error(
                                                    'error:',
                                                    chrome.runtime.lastError
                                                        .message
                                                )
                                            return
                                        }
                                        testMode && console.log('res', res)
                                        getStatus()
                                        sendResponse({})
                                    }
                                )
                            }
                        )
                    }
                )
            }
        )
    })
}

const actionLeave = () => {
    chrome.storage.local.get(['ovice_tab_id'], (data) => {
        chrome.tabs.update(
            Number(data.ovice_tab_id),
            { selected: true },
            function (tab) {
                chrome.windows.update(
                    tab.windowId,
                    {
                        focused: true,
                    },
                    () => {
                        chrome.scripting.executeScript(
                            {
                                target: { tabId: tab.id },
                                files: [
                                    'js/oviceConnecter.js',
                                    'js/actionLeave.js',
                                ],
                            },
                            () => {
                                if (chrome.runtime.lastError) {
                                    testMode &&
                                        console.error(
                                            'error:',
                                            chrome.runtime.lastError.message
                                        )
                                    return
                                }
                                chrome.runtime.sendMessage(
                                    'get_ovice_status',
                                    (res) => {
                                        if (chrome.runtime.lastError) {
                                            testMode &&
                                                console.error(
                                                    'error:',
                                                    chrome.runtime.lastError
                                                        .message
                                                )
                                            return
                                        }
                                        getStatus()
                                        sendResponse(res)
                                    }
                                )
                            }
                        )
                    }
                )
            }
        )
    })
}

// chrome.commands.onCommand.addListener((command) => {
//     testMode && console.log(`Command: ${command}`)
//     switch (command) {
//         case 'ovice_option':
//             // chrome.runtime.openOptionsPage(() => {})
//             chrome.windows.create({
//                 type: 'popup',
//                 url: './dist/index.html',
//                 height: 230,
//                 width: 450,
//             })
//             break
//         case 'action_mic_change':
//             actionMicChange()
//             break
//         case 'action_screenshare_change':
//             actionScreenshareChange()
//             break
//         case 'action_move_to_ovice':
//             actionMoveToOvice()
//             break
//         case 'action_volume_change':
//             actionVolumeChange()
//             break
//         case 'action_rest':
//             actionRest()
//             break
//         case 'action_leave':
//             actionLeave()
//             break
//         default:
//     }
// })

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    testMode && console.log('request', request)
    switch (request) {
        case 'get_ovice_status':
            polingOviceStatus('', 0)
            chrome.storage.local.get(
                [
                    'ovice_tab_id',
                    'ovice_place',
                    'ovice_place_type',
                    'ovice_has_logout',
                    'ovice_has_openspace',
                    'ovice_has_coffee',
                    'ovice_has_screenshare',
                    'ovice_has_mic',
                    'ovice_mic_on',
                    'ovice_volume_on',
                    'ovice_screenshare_on',
                ],
                (data) => {
                    testMode && console.log('ovice_status', data)
                    sendResponse(data)
                }
            )
            break
        case 'action_mic_change':
            actionMicChange()
            break
        case 'action_screenshare_change':
            actionScreenshareChange()
            break
        case 'action_move_to_ovice':
            actionMoveToOvice()
            break
        case 'action_volume_change':
            actionVolumeChange()
            break
        case 'action_rest':
            actionRest()
            break
        case 'action_leave':
            actionLeave()
            break
        default:
            sendResponse({})
    }

    return true
})
