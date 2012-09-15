// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var Config = Config || {};
(function(){
    Config.defaultDuration = [
        {"start":"08:00","end":"08:45"},
        {"start":"08:00","end":"08:45"},
        {"start":"08:00","end":"08:45"},
        {"start":"08:00","end":"08:45"},
        {"start":"08:00","end":"08:45"},
        {"start":"08:00","end":"08:45"},
        {"start":"08:00","end":"08:45"},
        {"start":"08:00","end":"08:45"},
        {"start":"08:00","end":"08:45"},
        {"start":"08:00","end":"08:45"},
        {"start":"08:00","end":"08:45"}
    ];
    Config.setupDefault = function() {
        if (!window.localStorage["CourseDuration"]) {
            window.localStorage["CouserDuration"] = JSON.stringify(Config.defaultDuration);
        }
    }
    Config.getDuration = function() {
        var duration = window.localStorage["CourseDuration"];
        return duration;
    }
    Config.setDuration = function(duration) {
        if (typeof duration === "string") {
            window.localStorage["CouserDuration"] = duration;
        } else {
            window.localStorage["CouserDuration"] = JSON.stringify(duration);
        }
    }
    Config.setupDefault();
})()
var oauth = ChromeExOAuth.initBackgroundPage({
    'request_url' : 'https://www.google.com/accounts/OAuthGetRequestToken',
    'authorize_url' : 'https://www.google.com/accounts/OAuthAuthorizeToken',
    'access_url' : 'https://www.google.com/accounts/OAuthGetAccessToken',
    'consumer_key' : '817070761549.apps.googleusercontent.com',
    'consumer_secret' : 'syFNEiQY4IWg8uKWwwZcFjW8',
    'scope' : 'https://www.googleapis.com/auth/calendar',
    'app_name' : '浙大课表同步助手'
});

function setIcon() {
    if (oauth.hasToken()) {
        chrome.browserAction.setIcon({
            'path' : 'img/icon-19-on.png'
        });
    } else {
        chrome.browserAction.setIcon({
            'path' : 'img/icon-19-off.png'
        });
    }
};

function onContacts(text, xhr) {
    contacts = [];
    var data = JSON.parse(text);
    for (var i = 0, entry; entry = data.feed.entry[i]; i++) {
        var contact = {
            'name' : entry['title']['$t'],
            'id' : entry['id']['$t'],
            'emails' : []
        };

        if (entry['gd$email']) {
            var emails = entry['gd$email'];
            for (var j = 0, email; email = emails[j]; j++) {
                contact['emails'].push(email['address']);
            }
        }

        if (!contact['name']) {
            contact['name'] = contact['emails'][0] || "<Unknown>";
        }
        contacts.push(contact);
    }

    chrome.tabs.create({
        'url' : 'contacts.html'
    });
};

function getContacts() {
    oauth.authorize(function() {
        
        var url = "http://www.google.com/m8/feeds/contacts/default/full";
        oauth.sendSignedRequest(url, onContacts, {
            'parameters' : {
                'alt' : 'json',
                'max-results' : 100
            }
        });
    });
};

function logout() {
    oauth.clearTokens();
};
