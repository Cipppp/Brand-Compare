const corsProxy = require('cors-anywhere');

const host = 'localhost';
const port = 8080;
const corsOptions = {
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2'],
};

corsProxy.createServer(corsOptions).listen(port, host, () => {
    console.log(`CORS Anywhere server running on ${host}:${port}`);
});
