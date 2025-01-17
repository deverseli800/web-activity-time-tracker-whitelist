'use strict';

var tabs;
var timeIntervalList;
var currentTab;
var isNeedDeleteTimeIntervalFromTabs = false;
var activity = new Activity();
var storage = new LocalStorage();
var authHelper = new AuthHelper();
var deferredRestrictionsList;

var setting_white_list;
var setting_restriction_list;
var setting_interval_save;
var setting_interval_inactivity;
var setting_view_in_badge;
var setting_block_deferral;
var setting_dark_mode;
var setting_notification_list;
var setting_notification_message;

var isHasPermissioForYouTube;
var isHasPermissioForNetflix;
var isHasPermissioForNotification;

let lastActiveTabUrl = '';
let tabToUrl = {};

function updateSummaryTime() {
    setInterval(backgroundCheck, SETTINGS_INTERVAL_CHECK_DEFAULT);
}

function updateStorage() {
    setInterval(backgroundUpdateStorage, SETTINGS_INTERVAL_SAVE_STORAGE_DEFAULT);
}

function backgroundCheck() {
    chrome.windows.getLastFocused({ populate: true }, function(currentWindow) {
        if (currentWindow && currentWindow.focused) {
            var activeTab = currentWindow.tabs.find(t => t.active === true);
            if (activeTab !== undefined && activity.isValidPage(activeTab)) {
                var activeUrl = new Url(activeTab.url);
                var tab = activity.getTab(activeUrl);
                if (tab === undefined) {
                    activity.addTab(activeTab);
                }

                if (activity.isInBlackList(activeUrl)) {
                    chrome.browserAction.setBadgeBackgroundColor({ color: '#FF0000' })
                    chrome.browserAction.setBadgeText({
                        tabId: activeTab.id,
                        text: 'n/a'
                    });
                } else {
                    if (tab !== undefined) {
                        if (!tab.url.isMatch(currentTab)) {
                            activity.setCurrentActiveTab(tab.url);
                        }
                        chrome.idle.queryState(parseInt(setting_interval_inactivity), state => {
                            if (state === 'active') {
                                mainTRacker(activeUrl, tab, activeTab);
                            } else checkDOM(state, activeUrl, tab, activeTab);
                        });
                    }
                }
            }
        } else activity.closeIntervalForCurrentTab(true);
    });
}

function mainTRacker(activeUrl, tab, activeTab) {
    if (activity.isLimitExceeded(activeUrl, tab) && !activity.wasDeferred(activeUrl)) {
        setBlockPageToCurrent(activeTab.url);
    }
    if (!activity.isInBlackList(activeUrl)) {
        if (activity.isNeedNotifyView(activeUrl, tab)) {
            if (isHasPermissioForNotification) {
                showNotification(activeUrl, tab);
            } else {
                checkPermissionsForNotifications(showNotification, activeUrl, tab);
            }
        }
        tab.incSummaryTime();
    }
    if (setting_view_in_badge === true) {
        chrome.browserAction.setBadgeBackgroundColor({ color: '#1aa1434d' })
        var summary = tab.days.find(s => s.date === todayLocalDate()).summary;
        chrome.browserAction.setBadgeText({
            tabId: activeTab.id,
            text: String(convertSummaryTimeToBadgeString(summary))
        });
    } else {
        chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] })
        chrome.browserAction.setBadgeText({
            tabId: activeTab.id,
            text: ''
        });
    }
}

function showNotification(activeUrl, tab) {
    chrome.notifications.clear('watt-site-notification', function(wasCleared) {
        if (!wasCleared) {
            console.log('!wasCleared');

            chrome.notifications.create(
                'watt-site-notification', {
                    type: 'basic',
                    iconUrl: 'icons/128x128.png',
                    title: "Web Activity Time Tracker",
                    contextMessage: activeUrl + ' ' + convertShortSummaryTimeToString(tab.getTodayTime()),
                    message: setting_notification_message
                },
                function(notificationId) {
                    console.log(notificationId);
                    chrome.notifications.clear('watt-site-notification', function(wasCleared) {
                        if (wasCleared)
                            notificationAction(activeUrl, tab);
                    });
                });
        } else {
            notificationAction(activeUrl, tab);
        }
    });
}

function notificationAction(activeUrl, tab) {
    chrome.notifications.create(
        'watt-site-notification', {
            type: 'basic',
            iconUrl: 'icons/128x128.png',
            title: "Web Activity Time Tracker",
            contextMessage: activeUrl + ' ' + convertShortSummaryTimeToString(tab.getTodayTime()),
            message: setting_notification_message
        });
}

function setBlockPageToCurrent(currentUrl) {
    var blockUrl = chrome.runtime.getURL("block.html") + '?url=' + currentUrl;
    chrome.tabs.query({ currentWindow: true, active: true }, function(tab) {
        chrome.tabs.update(tab.id, { url: blockUrl });
    });
}

function isVideoPlayedOnPage() {
    var videoElement = document.getElementsByTagName('video')[0];
    if (videoElement !== undefined && videoElement.currentTime > 0 && !videoElement.paused && !videoElement.ended && videoElement.readyState > 2) {
        return true;
    } else return false;
}

function checkDOM(state, activeUrl, tab, activeTab) {
    if (state === 'idle' && activeUrl.isMatch("youtube.com")) {
        trackForYT(mainTRacker, activeUrl, tab, activeTab);
    } else if (state === 'idle' && activeUrl.isMatch("netflix.com")) {
        trackForNetflix(mainTRacker, activeUrl, tab, activeTab);
    } else activity.closeIntervalForCurrentTab();
}

function trackForYT(callback, activeUrl, tab, activeTab) {
    if (isHasPermissioForYouTube) {
        executeScriptYoutube(callback, activeUrl, tab, activeTab);
    } else {
        checkPermissionsForYT(executeScriptYoutube, activity.closeIntervalForCurrentTab, callback, activeUrl, tab, activeTab);
    }
}

function trackForNetflix(callback, activeUrl, tab, activeTab) {
    if (isHasPermissioForNetflix) {
        executeScriptNetflix(callback, activeUrl, tab, activeTab);
    } else {
        checkPermissionsForNetflix(executeScriptNetflix, activity.closeIntervalForCurrentTab, callback, activeUrl, tab, activeTab);
    }
}

function executeScriptYoutube(callback, activeUrl, tab, activeTab) {
    chrome.tabs.executeScript({ code: "var videoElement = document.getElementsByTagName('video')[0]; (videoElement !== undefined && videoElement.currentTime > 0 && !videoElement.paused && !videoElement.ended && videoElement.readyState > 2);" }, (results) => {
        if (results !== undefined && results[0] !== undefined && results[0] === true)
            callback(activeUrl, tab, activeTab);
        else activity.closeIntervalForCurrentTab();
    });
}

function executeScriptNetflix(callback, activeUrl, tab, activeTab) {
    chrome.tabs.executeScript({ code: "var videoElement = document.getElementsByTagName('video')[0]; (videoElement !== undefined && videoElement.currentTime > 0 && !videoElement.paused && !videoElement.ended && videoElement.readyState > 2);" }, (results) => {
        if (results !== undefined && results[0] !== undefined && results[0] === true) {
            callback(activeUrl, tab, activeTab);
        } else {
            activity.closeIntervalForCurrentTab();
        }
    });
}

function backgroundUpdateStorage() {
    if (tabs != undefined && tabs.length > 0)
        storage.saveTabs(tabs);
    if (timeIntervalList != undefined && timeIntervalList.length > 0)
        storage.saveValue(STORAGE_TIMEINTERVAL_LIST, timeIntervalList);
}

const showGeolocationError = (error) => {
    storage.saveValue(USER_LOCATION_LAT, null);
    storage.saveValue(USER_LOCATION_LONG, null);
    console.error(GEOLOCATION_ERROR_MSG, error);
}

const saveCurrentPosition = (position) => {
    storage.saveValue(USER_LOCATION_LAT, position.coords.latitude);
    storage.saveValue(USER_LOCATION_LONG, position.coords.longitude);
}

function setDefaultSettings() {
    storage.saveValue(SETTINGS_INTERVAL_INACTIVITY, SETTINGS_INTERVAL_INACTIVITY_DEFAULT);
    storage.saveValue(SETTINGS_INTERVAL_RANGE, SETTINGS_INTERVAL_RANGE_DEFAULT);
    storage.saveValue(SETTINGS_VIEW_TIME_IN_BADGE, SETTINGS_VIEW_TIME_IN_BADGE_DEFAULT);
    storage.saveValue(SETTINGS_BLOCK_DEFERRAL, SETTINGS_BLOCK_DEFERRAL_DEFAULT);
    storage.saveValue(SETTINGS_DARK_MODE, SETTINGS_DARK_MODE_DEFAULT);
    storage.saveValue(SETTINGS_INTERVAL_SAVE_STORAGE, SETTINGS_INTERVAL_SAVE_STORAGE_DEFAULT);
    storage.saveValue(STORAGE_NOTIFICATION_MESSAGE, STORAGE_NOTIFICATION_MESSAGE_DEFAULT);
    navigator.geolocation.getCurrentPosition(saveCurrentPosition, showGeolocationError);
}

function checkSettingsImEmpty() {
    chrome.storage.local.getBytesInUse(['inactivity_interval'], function(item) {
        if (item == 0) {
            setDefaultSettings();
        }
    });
}

function setDefaultValueForNewSettings() {
    loadNotificationMessage();
}

const getStartTime = (param) => {
    const {year, month, day, hourStart, minStart, secStart, msStart} = param;
    return Date.UTC(year, month - 1, day, hourStart, minStart, secStart, msStart);
}

const getMilliseconds = (hour, min, sec, ms) => {
    return hour * HOURS_MS + min * MIN_MS + sec * SEC_MS + ms;
}

const getDuration = (param) => {
    const {hourEnd, minEnd, secEnd, msEnd, hourStart, minStart, secStart, msStart} = param;
    const countSecEnd = getMilliseconds(hourEnd, minEnd, secEnd, msEnd);
    const countSecStart = getMilliseconds(hourStart, minStart, secStart, msStart);
    return countSecEnd - countSecStart;
}

const extractTime = (start, end) => {
    const startArr = start.split(':');
    const endArr = end.split(':');
    const [hourStart, minStart, secStart, msStart] = startArr;
    const [hourEnd, minEnd, secEnd, msEnd] = endArr;

    return {
        hourStart: +hourStart,
        minStart: +minStart,
        secStart: +secStart,
        msStart: +msStart,
        hourEnd: +hourEnd,
        minEnd: +minEnd,
        secEnd: +secEnd,
        msEnd: +msEnd
    }
}

const filterIntervalsArray = (intervals = []) => {
    return intervals.filter(interval => {
        const [intervalStart, intervalEnd] = interval.split('-');
        const startIndex = intervalStart.lastIndexOf(':');
        const endIndex = intervalEnd.lastIndexOf(':');
        const intervalStartWithoutMs = intervalStart.slice(0, startIndex);
        const intervalEndWithoutMs = intervalEnd.slice(0, endIndex);

        return intervalStartWithoutMs !== intervalEndWithoutMs;
    });
}

const mapTime = (item) => {
    const intervalsArray = filterIntervalsArray(item.intervals);
    const intervalLength = intervalsArray.length;

    if (!intervalLength) return {duration: null, startTime: null};

    const [month, day, year] = item.day.split('/');
    const lastInterval = intervalsArray[intervalLength - 1];
    const [start, end] = lastInterval.split('-');
    const {hourStart, minStart, secStart, msStart, hourEnd, minEnd, secEnd, msEnd} = extractTime(start, end);
    const startTime = getStartTime({
        year: +year,
        month: +month,
        day: +day,
        hourStart,
        minStart,
        secStart,
        msStart
    }) || null;
    const duration = getDuration({
        hourEnd,
        minEnd,
        secEnd,
        msEnd,
        hourStart,
        minStart,
        secStart,
        msStart
    }) || null;
    return {duration, startTime};
}

const handleAuthError = async (requestBody) => {
    await authHelper.runAuthProcess();
    await postUserActivity(requestBody);
}

const postUserActivityHandler = async (requestBody) => {
    const idToken = await storage.getValuePromise(STORAGE_ID_TOKEN);
    return await fetch(TRACK_USER_ACTIVITY_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(requestBody)
    });
}

const postUserActivity = async (requestBody) => {
    try {
        const response = await postUserActivityHandler(requestBody);

        if (!response.ok && response.status === 403) {
            throw new AuthenticationError(AUTH_ERROR_MSG);
        }
    } catch(error) {
        console.error(error);
        if (error instanceof AuthenticationError) {
            await handleAuthError(requestBody);
        }
    }
}

const trackUserActivity = async (lastActiveUrl, actionType) => {
    try {
        const [userEmail, latitude, longitude] = await Promise.all([
            storage.getValuePromise(STORAGE_USER_EMAIL),
            storage.getValuePromise(USER_LOCATION_LAT),
            storage.getValuePromise(USER_LOCATION_LONG)
        ]);
        let listItems = timeIntervalList || [];
        listItems = listItems
            .filter(item => item.day === todayLocalDate())
            .filter(item => lastActiveUrl.includes(item.url.host));
        const activityArray = listItems.reduce((result, item) => {
            const { duration, startTime } = mapTime(item);
            if (duration) {
                result.push( {
                    url: new Url(lastActiveUrl) || item.url,
                    duration,
                    startTime,
                    actionType
                });
            }
            return result;
        }, []);

        if (activityArray.length) {
            const requestBody =  {
                user: userEmail || '',
                location: {
                    latitude,
                    longitude
                },
                activity: activityArray
            };
            postUserActivity(requestBody);
        }
    } catch(error) {
        console.error(error);
    }
}

const getInfoFromStorage = (itemName, defaultValue) => {
    return new Promise((resolve, reject) => {
        storage.getValue(itemName, result => {
            resolve(result || defaultValue);
        });
    });
}

const findTabInWhiteList = async (lastActiveTabUrl) => {
    if (!lastActiveTabUrl) return -1;
    const whiteList = await getInfoFromStorage(STORAGE_WHITE_LIST, []);
    return whiteList.findIndex(item => lastActiveTabUrl.includes(item.href.split('://')[1]));
}

function addListener() {
    chrome.tabs.onActivated.addListener(activeInfo => {
        chrome.tabs.get(activeInfo.tabId, async (tab) => {
            activity.addTab(tab);
            const tabIndex = await findTabInWhiteList(tab.url);
            const lastActiveTabIndex = await findTabInWhiteList(lastActiveTabUrl);

            if (tabIndex !== -1 && lastActiveTabIndex !== -1 && tabIndex !== lastActiveTabIndex) {
                await trackUserActivity(lastActiveTabUrl, CHROME_EVENTS.TABS.ONACTIVATED);
            }
            if (tabIndex === -1 && lastActiveTabIndex !== -1) {
                await trackUserActivity(lastActiveTabUrl, CHROME_EVENTS.TABS.ONACTIVATED);
            }
            lastActiveTabUrl = tab.url;
            tabToUrl[activeInfo.tabId] = tab.url;
        });
    });

    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete') {
            const tabIndex = await findTabInWhiteList(tab.url);
            if (lastActiveTabUrl !== tab.url &&
                lastActiveTabUrl !== EMPTY_TAB_URL &&
                tabIndex !== -1
            ) {
                const lastActiveTabIndex = await findTabInWhiteList(lastActiveTabUrl);
                if (lastActiveTabIndex !== -1 &&
                    lastActiveTabIndex !== tabIndex
                ) {
                    trackUserActivity(lastActiveTabUrl, CHROME_EVENTS.TABS.ONUPDATED);
                }
            }
            lastActiveTabUrl = tab.url;
            tabToUrl[tabId] = tab.url;
        }
    });

    chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
        if (removeInfo.isWindowClosing) {
            if (tabToUrl[tabId] === lastActiveTabUrl) {
                const tabIndex = await findTabInWhiteList(lastActiveTabUrl);
                if (tabIndex !== -1) trackUserActivity(lastActiveTabUrl, CHROME_EVENTS.BROWSER.ONREMOVED);
            };
            return;
        };
        delete tabToUrl[tabId];
    });

    chrome.idle.onStateChanged.addListener(newState => {
        if (newState === 'idle' || newState === 'locked') {
            trackUserActivity(lastActiveTabUrl, CHROME_EVENTS.TABS.NOACTIVITY);
        }
    });

    chrome.webNavigation.onCompleted.addListener(function(details) {
        chrome.tabs.get(details.tabId, function(tab) {
            activity.updateFavicon(tab);
        });
    });

    chrome.runtime.onInstalled.addListener(function(details) {
        if (details.reason == 'install') {
            storage.saveValue(SETTINGS_SHOW_HINT, SETTINGS_SHOW_HINT_DEFAULT);
            setDefaultSettings();
        }
        if (details.reason == 'update') {
            storage.saveValue(SETTINGS_SHOW_HINT, SETTINGS_SHOW_HINT_DEFAULT);
            checkSettingsImEmpty();
            setDefaultValueForNewSettings();
            isNeedDeleteTimeIntervalFromTabs = true;
        }
    });

    chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (var key in changes) {
            if (key === STORAGE_WHITE_LIST) {
                loadWhiteList();
            }
            if (key === STORAGE_RESTRICTION_LIST) {
                loadRestrictionList();
            }
            if (key === STORAGE_NOTIFICATION_LIST) {
                loadNotificationList();
            }
            if (key === STORAGE_NOTIFICATION_MESSAGE) {
                loadNotificationMessage();
            }
            if (key === SETTINGS_INTERVAL_INACTIVITY) {
                storage.getValue(SETTINGS_INTERVAL_INACTIVITY, (item) => {
                    setting_interval_inactivity = item;
                    chrome.idle.setDetectionInterval(+setting_interval_inactivity);
                });
            }
            if (key === SETTINGS_VIEW_TIME_IN_BADGE) {
                storage.getValue(SETTINGS_VIEW_TIME_IN_BADGE, function(item) { setting_view_in_badge = item; });
            }
            if (key === SETTINGS_BLOCK_DEFERRAL) {
                storage.getValue(SETTINGS_BLOCK_DEFERRAL, function(item) { setting_block_deferral = item; });
            }
            if (key === SETTINGS_DARK_MODE) {
                storage.getValue(SETTINGS_DARK_MODE, function(item) { setting_dark_mode = item; });
            }
        }
    });

    chrome.runtime.setUninstallURL("https://docs.google.com/forms/d/e/1FAIpQLSdImHtvey6sg5mzsQwWfAQscgZOOV52blSf9HkywSXJhuQQHg/viewform");
}

function loadTabs() {
    storage.loadTabs(STORAGE_TABS, function(items) {
        tabs = [];
        items = items || [];

        for (var i = 0; i < items.length; i++) {
            tabs.push(new Tab(items[i].url, items[i].favicon, items[i].days, items[i].summaryTime, items[i].counter));
        }
        if (isNeedDeleteTimeIntervalFromTabs)
            deleteTimeIntervalFromTabs();
    });
}

function deleteTimeIntervalFromTabs() {
    tabs.forEach(function(item) {
        item.days.forEach(function(day) {
            if (day.time != undefined)
                day.time = [];
        })
    })
}

function deleteYesterdayTimeInterval() {
    timeIntervalList = timeIntervalList.filter(x => x.day == todayLocalDate());
}

function loadWhiteList() {
    storage.getValue(STORAGE_WHITE_LIST, function(items) {
        setting_white_list = [];
        items = items || [];

        for (var i = 0; i < items.length; i++) {
            setting_white_list.push(new Url(items[i]));
        }
    })
}

function loadTimeIntervals() {
    storage.getValue(STORAGE_TIMEINTERVAL_LIST, function(items) {
        timeIntervalList = [];
        items = items || [];

        for (var i = 0; i < items.length; i++) {
            // get user
            timeIntervalList.push(new TimeInterval(items[i].day, items[i].url || items[i].domain, items[i].intervals));
        }
        deleteYesterdayTimeInterval();
    });
}

function loadRestrictionList() {
    storage.getValue(STORAGE_RESTRICTION_LIST, function(items) {
        setting_restriction_list = [];
        items = items || [];

        for (var i = 0; i < items.length; i++) {
            setting_restriction_list.push(new Restriction(items[i].url || items[i].domain, items[i].time));
        }
    });
}

function loadNotificationList() {
    storage.getValue(STORAGE_NOTIFICATION_LIST, function(items) {
        setting_notification_list = [];
        items = items || [];

        for (var i = 0; i < items.length; i++) {
            setting_notification_list.push(new Notification(items[i].url || items[i].domain, items[i].time));
        }
    });
}

function loadNotificationMessage() {
    storage.getValue(STORAGE_NOTIFICATION_MESSAGE, function(item) {
        setting_notification_message = item;
        if (isEmpty(setting_notification_message)) {
            storage.saveValue(STORAGE_NOTIFICATION_MESSAGE, STORAGE_NOTIFICATION_MESSAGE_DEFAULT);
            setting_notification_message = STORAGE_NOTIFICATION_MESSAGE_DEFAULT;
        }
    });
}

function loadSettings() {
    storage.getValue(SETTINGS_INTERVAL_INACTIVITY, function(item) { setting_interval_inactivity = item; });
    storage.getValue(SETTINGS_VIEW_TIME_IN_BADGE, function(item) { setting_view_in_badge = item; });
    storage.getValue(SETTINGS_BLOCK_DEFERRAL, function(item) { setting_block_deferral = item; });
    storage.getValue(SETTINGS_DARK_MODE, function(item) { setting_dark_mode = item; });
}

function loadAddDataFromStorage() {
    loadTabs();
    loadTimeIntervals();
    loadWhiteList();
    loadRestrictionList();
    loadNotificationList();
    loadNotificationMessage();
    loadSettings();
}

function loadPermissions() {
    checkPermissionsForYT();
    checkPermissionsForNetflix();
    checkPermissionsForNotifications();
}

function checkPermissionsForYT(callbackIfTrue, callbackIfFalse, ...props) {
    chrome.permissions.contains({
        permissions: ['tabs'],
        origins: ["https://www.youtube.com/*"]
    }, function(result) {
        if (callbackIfTrue != undefined && result)
            callbackIfTrue(...props);
        if (callbackIfFalse != undefined && !result)
            callbackIfFalse();
        isHasPermissioForYouTube = result;
    });
}

function checkPermissionsForNetflix(callbackIfTrue, callbackIfFalse, ...props) {
    chrome.permissions.contains({
        permissions: ['tabs'],
        origins: ["https://www.netflix.com/*"]
    }, function(result) {
        if (callbackIfTrue != undefined && result)
            callbackIfTrue(...props);
        if (callbackIfFalse != undefined && !result)
            callbackIfFalse();
        isHasPermissioForNetflix = result;
    });
}

function checkPermissionsForNotifications(callback, ...props) {
    chrome.permissions.contains({
        permissions: ["notifications"]
    }, function(result) {
        if (callback != undefined && result)
            callback(...props);
        isHasPermissioForNotification = result;
    });
}

authHelper.runAuthProcess();
loadPermissions();
addListener();
loadAddDataFromStorage();
updateSummaryTime();
updateStorage();
