const corsProxy = require('cors-anywhere');

//? Set CORS Anywhere server host and port
const host = 'localhost';
const port = 8080;

//? Default options for CORS Anywhere server
const corsOptions = {
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2'],
};

//? Start CORS Anywhere server on port 8080
corsProxy.createServer(corsOptions).listen(port, host, () => {
    console.log(`CORS Anywhere server running on ${host}:${port}`);
});
