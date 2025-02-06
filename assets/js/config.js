document.addEventListener('DOMContentLoaded', () => {
    window.CONFIG = {
        API_URL: 'https://issessionsctf.ctfd.io/api/v1/scoreboard', // Added CORS Proxy
        UPDATE_INTERVAL: 10000, // 10s for testing, usually 5 minutes so 300000ms
        MAX_TEAMS: 200,
        //DEMO_MODE: true,
        API_TOKEN: 'ctfd_5778be3517d62c30d45d5d3a9f1de7ab61637371060cb12600dda4589124237d', // Add this line
        FONT_FAMILY: "'Press Start 2P', cursive", // Add font config
    };
});
