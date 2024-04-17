const BASE_URL = 'http://dev-server:7060';
const COMMON_HEADERS = {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
};

const fetchWithCommonOptions = async (url: string, options: any) => {
    const mergedOptions = {
        ...options,
        headers: {
            ...COMMON_HEADERS,
            ...options.headers,
        },
    };

    return fetch(`${BASE_URL}${url}`, mergedOptions);
};

export default fetchWithCommonOptions;