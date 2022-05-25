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
        Promise.all(dataSet).then(async (results) => {
            let mentioned = false
            let messsageCount = 0
            results.forEach((item) => {
                if (item.openChatBox) {
                    mentioned = true
                } else {
                    if (item.newChatMessageCount > 0) {
                        messsageCount += item.newChatMessageCount
                    }
                }
            })
            const micHasSpaceCount = results.filter((item) => {
                return item.hasMic
            }).length
            const micOnSpaceCount = results.filter((item) => {
                return item.micState
            }).length
            if (micHasSpaceCount > 0) {
                if (micOnSpaceCount > 0) {
                    chrome.action.setIcon({
                        path: 'icons/icon_32_on.png',
                    })
                } else {
                    chrome.action.setIcon({
                        path: 'icons/icon_32_off.png',
                    })
                }
            } else {
                chrome.action.setIcon({
                    path: 'icons/icon_32_none.png',
                })
            }
            if (mentioned) {
                await chrome.action.setBadgeBackgroundColor({
                    color: '#ff0000',
                })
                await chrome.action.setBadgeText({ text: '!' })
            } else if (messsageCount > 0) {
                await chrome.action.setBadgeBackgroundColor({
                    color: '#0000ff',
                })
                await chrome.action.setBadgeText({
                    text: `${messsageCount}`,
                })
            } else {
                await chrome.action.setBadgeBackgroundColor({
                    color: '#0000ff',
                })
                await chrome.action.setBadgeText({ text: '' })
            }
            chrome.storage.local.set({ ovice_tabs_data: results })
        })
    })
}

let counter = 0
const tick = setInterval(() => {
    testMode && console.log('tick')
    testMode && console.log('counter', counter)
    if (counter % 5 === 0) {
        polingOviceTabsStatus()
    }
    counter++
}, 1000)

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
            polingOviceTabsStatus()
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
