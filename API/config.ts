const CONFIG = {
    ROUTES: {
        RECORD: {
            CREATE: {
                ENDPOINT: '/api/record',
                METHOD: 'POST',
            },
        },
        CATEGORY: {
            CREATE: {
                ENDPOINT: '/api/category',
                METHOD: 'POST',
            },
        },
    },
    FETCH_CONFIG: {
        headers: {
            'Content-Type': 'application/json',
        },
    },
} as const;

export default CONFIG;
