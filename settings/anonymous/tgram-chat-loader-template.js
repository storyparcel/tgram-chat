(function () {
    if (!window.TgramPublic) {
        window.TgramPublic = {};
    }

    window.TgramPublic.initialized = false;

    async function initTGram(options) {
        if (window.TgramPublic.initialized) {
            console.warn('TgramPublic is already initialized.');
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
            const response = await fetch('{{IFRAME_SRC}}');
            if (!response.ok) {
                throw new Error('Failed to fetch HTML content');
            }
            const iframeContent = await response.text();
            iframe.srcdoc = iframeContent;

            iframe.onload = function () {
                iframe.contentWindow.postMessage({
                    type: 'INIT_TGRAM_CHAT',
                    ragUuid: options.ragUuid,
                }, '*');
            };

            window.addEventListener('message', function (event) {
                switch (event.data.type) {
                    case 'IFRAME_READY':
                        window.TgramPublic.initialized = true;
                        break;
                    default:
                }
            });

            window.TgramPublic.reconnectChat = function () {
                if (window.TgramPublic.initialized) {
                    iframe.contentWindow.postMessage({
                        type: 'RECONNECT_CHAT',
                    }, '*');
                } else {
                    console.warn('TgramPublic is not initialized yet.');
                }
            };
        } catch (error) {
            console.error('Error loading iframe content:', error);
        }
    }

    window.TgramPublic.init = initTGram;
})();
