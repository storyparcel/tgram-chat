(function () {
    if (!window.TgramChat) {
        window.TgramChat = {};
    }

    window.TgramChat.initialized = false;

    async function initTGram(options) {
        if (window.TgramChat.initialized) {
            console.warn('TgramChat is already initialized.');
            return;
        }

        var iframe = document.createElement('iframe');
        iframe.id = 'tgram-plugin-script-iframe';
        iframe.title = 'tgram-chat';
        iframe.style = 'position:relative!important;height:100%!important;width:100%!important;border:none!important;';
        var container = document.getElementById(options.containerId);
        if (container) {
            container.appendChild(iframe);
        }

        try {
            const response = await fetch('https://cdn.jsdelivr.net/gh/storyparcel/tgram-chat/public/prod/dashboard/tgram-chat.html');
            if (!response.ok) {
                throw new Error('Failed to fetch HTML content');
            }
            const iframeContent = await response.text();
            iframe.srcdoc = iframeContent;

            iframe.onload = function () {
                iframe.contentWindow.postMessage({
                    type: 'INIT_TGRAM_CHAT',
                    token: options.token,
                    sessionId: options.sessionId,
                }, '*');
            };

            window.addEventListener('message', function (event) {
                switch (event.data.type) {
                    case 'TOKEN_EXPIRED':
                        options.onTokenExpired().then(newToken => {
                            iframe.contentWindow.postMessage({
                                type: 'UPDATE_TOKEN',
                                token: newToken,
                            }, '*');
                        });
                        break;
                    case 'FIRST_MESSAGE_SENT':
                        options.onFirstMessageSent();
                        break;
                    case 'IFRAME_READY':
                        window.TgramChat.initialized = true;
                        break;
                    default:
                }
            });

            window.TgramChat.updateSessionId = function (newSessionId) {
                if (window.TgramChat.initialized) {
                    iframe.contentWindow.postMessage({
                        type: 'UPDATE_SESSION_ID',
                        sessionId: newSessionId,
                    }, '*');
                } else {
                    console.warn('TgramChat is not initialized yet.');
                }
            };
        } catch (error) {
            console.error('Error loading iframe content:', error);
        }
    }

    window.TgramChat.init = initTGram;
})();
