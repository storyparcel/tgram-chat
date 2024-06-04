(function () {
    if (!window.TgramChat) {
        window.TgramChat = {};
    }

    window.TgramChat.initialized = false;

    function initTGram(options) {
        if (window.TgramChat.initialized) {
            console.warn('TgramChat is already initialized.');
            return;
        }

        var iframe = document.createElement('iframe');
        iframe.id = 'tgram-plugin-script-iframe';
        // iframe.src = 'https://cdn.jsdelivr.net/gh/storyparcel/tgram-chat/public/tgram-chat/tgram-chat.html';
        // iframe.src = 'http://localhost:9000/public/tgram-chat/tgram-chat.html';
        iframe.title = 'tgram-chat';
        iframe.style = 'position:relative!important;height:100%!important;width:100%!important;border:none!important;';
        var container = document.getElementById(options.containerId);
        if (container) {
            container.appendChild(iframe);
        }

        var iframeContent = `
        <!DOCTYPE html>
        <html lang="ko">

        <head>
            <meta charset="UTF-8">
            <title>Tgram</title>
            <script src="https://cdn.jsdelivr.net/gh/storyparcel/tgram-chat/dist/dev/main.94b224216209868a9dfe.js"></script>
            <style>
                body,
                html {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                }

                #tgram-chat-container {
                    width: 100%;
                    height: 100%;
                }
            </style>
        </head>

        <body>
            <div id="tgram-chat-container"></div>
            <script>
                let tgramInstance;

                window.addEventListener('message', function (event) {
                    if (!event.data) {
                        return;
                    }

                    console.log('html event get', event.data.type);
                    switch (event.data.type) {
                        case 'INIT_TGRAM_CHAT':
                            const initialToken = event.data.token;
                            const initialSessionId = event.data.sessionId;
                            initialize(initialToken, initialSessionId);
                            break;
                        case 'UPDATE_TOKEN':
                            const newToken = event.data.token;
                            if (tgramInstance.current) {
                                tgramInstance.current.updateToken(newToken);
                            }
                            break;
                        case 'UPDATE_SESSION_ID':
                            const newSessionId = event.data.sessionId;
                            if (tgramInstance.current) {
                                tgramInstance.current.updateSessionId(newSessionId);
                            }
                            break;
                        default:
                    }
                });

                window.addEventListener('DOMContentLoaded', function () {
                    console.log('from html iframe ready!');
                    parent.postMessage({
                        type: 'IFRAME_READY',
                    }, '*');
                });

                function onTokenExpired() {
                    parent.postMessage({ type: 'TOKEN_EXPIRED' }, '*');
                }

                function initialize(token, sessionId) {
                    tgramInstance = window.initMyChatbot({
                        containerId: "tgram-chat-container",
                        token,
                        sessionId,
                        onTokenExpired: onTokenExpired,
                    });
                }
            </script>
        </body>

        </html>
        `;
        iframe.srcdoc = iframeContent;

        iframe.onload = function () {
            iframe.contentWindow.postMessage({
                type: 'INIT_TGRAM_CHAT',
                token: options.token,
                sessionId: options.sessionId,
            }, '*');
        };

        window.addEventListener('message', function(event) {
            switch (event.data.type) {
                case 'TOKEN_EXPIRED':
                    options.onTokenExpired().then(newToken => {
                        iframe.contentWindow.postMessage({
                            type: 'UPDATE_TOKEN',
                            token: newToken,
                        }, '*');
                    });
                    break;
                case 'IFRAME_READY':
                    window.TgramChat.initialized = true;
                    break;
                default:
            }
        });

        window.TgramChat.updateSessionId = function(newSessionId) {
            if (window.TgramChat.initialized) {
                iframe.contentWindow?.postMessage({
                    type: 'UPDATE_SESSION_ID',
                    sessionId: newSessionId,
                }, '*');
            } else {
                console.warn('TgramChat is not initialized yet.');
            }
        };
    }

    window.TgramChat.init = initTGram;
})();
