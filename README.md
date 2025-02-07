## CTFd Live Scoreboard - Black Hat Bureau Edition - MISSION BOARD

This is a live scoreboard for CTFd. It updates every 5 minutes and displays the top 200 teams.

![CTFd Live Scoreboard](https://github.com/user-attachments/assets/8e69d394-10bc-43e3-ad6e-007dcfadcfe3)

### Installation

1. Clone the repository: `git clone https://github.com/jondmarien/CTFd-Scoreboard.git
2. Run on a local server or pull from docker to CTFd: 
`python3 -m http.server 8000`
OR
`docker pull ghcr.io/jondmarien/ctfd-scoreboard:latest`

### Configuration
1. Create a `config.js` file with the following content:
```javascript
window.CONFIG = {
    API_URL: 'YOUR_API_URL',                    // Add your API URL here
    UPDATE_INTERVAL: 10000,                     // 10s for testing, usually 5 minutes so 300000ms
    MAX_TEAMS: 200,                             // Modify number of max teams if needed
    //DEMO_MODE: true,                          // set to false when deploying, true for demo data from CTFd
    API_TOKEN: 'YOUR_API_TOKEN',                // Add your API token here
    FONT_FAMILY: "'Press Start 2P', cursive",   // Add font config
};
```
