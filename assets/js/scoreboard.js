/** Matrix Themed Live Scoreboard - By Jonathan Marien **/ 
/**
 * Based off the CTFd API - https://docs.ctfd.io/docs/api/getting-started/    
 */

const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// Scoreboard Class
class Scoreboard {
    constructor() {
        console.log('Scoreboard: Constructor initialized');

        this.container = document.getElementById('scoreboard');
        if (!this.container) {
            console.error('Scoreboard: Container element not found');
        }

        this.setupTeamInteractions();
        this.lastUpdate = null;
        this.updateInterval = null;
        this.isLoading = false;
        
         // Initialize matrix after DOM is loaded
         if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initMatrix());
        } else {
            this.initMatrix();
        }

        this.startAutoUpdate();
        
        console.log('Scoreboard: Constructor initialized');
    }

    // Matrix Rain Function - From Gabriel S.
    initMatrix() {
        console.log('Matrix: Starting initialization');
        try {
            const canvas = document.getElementById('matrixCanvas');
            if (!canvas) {
                console.error('Matrix: Canvas element not found');
                return;
            }
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error('Matrix: Unable to get canvas context');
                return;
            }
            console.log('Matrix: Canvas context obtained');
    
            // Set canvas to full viewport size
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            console.log(`Matrix: Canvas dimensions set to ${canvas.width}x${canvas.height}`);
            
            const columns = canvas.width / 20;
            const drops = Array.from({ length: columns }).fill(0);
            console.log(`Matrix: Initialized ${columns} columns`);
    
            function drawMatrixRain() {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
    
                ctx.fillStyle = '#ff4d4d';
                ctx.font = '15px monospace';
    
                for (let i = 0; i < drops.length; i++) {
                    const text = String.fromCharCode(0x30A0 + Math.random() * 96);
                    ctx.fillText(text, i * 20, drops[i] * 20);
    
                    if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
            }
    
            console.log('Matrix: Starting animation loop');
            setInterval(drawMatrixRain, 33);
            
            window.addEventListener('resize', () => {
                console.log('Matrix: Handling window resize');
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
    
            console.log('Matrix: Initialization complete');
        } catch (error) {
            console.error('Matrix: Initialization failed', error);
        }
    }

    showLoading() {
        this.isLoading = true;
        this.container.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <div class="loading-text">Updating scoreboard...</div>
            </div>
        `;
    }

    showError(message) {
        this.isLoading = false;
        this.container.innerHTML = `
            <div class="error-state">
                <div class="error-icon">⚠️</div>
                <div class="error-message">Error: ${message}</div>
                <button onclick="scoreboard.retryUpdate()">Retry</button>
            </div>
        `;
    }

    // Function to handle team interactions
    setupTeamInteractions() {
        // Remove old event listeners by replacing the container
        const newContainer = this.container.cloneNode(true);
        this.container.parentNode.replaceChild(newContainer, this.container);
        this.container = newContainer;
    
        // Add new event listeners with proper delegation
        this.container.addEventListener('click', (e) => {
            const teamHeader = e.target.closest('.team-header');
            if (!teamHeader) return;
    
            const team = teamHeader.closest('.team');
            const membersDiv = team?.querySelector('.members');
            
            if (membersDiv) {
                const isHidden = membersDiv.style.display === 'none';
                membersDiv.style.display = isHidden ? 'block' : 'none';
                team.classList.toggle('expanded');
            }
        });
    }

    // Function to return mock data 
    getMockData() {
        return [
            {
                id: 35,
                name: "Red Team Alpha",
                score: 300,
                pos: 1,
                members: [
                    { id: 2, name: "Gabriel Sun", score: 150 },
                    { id: 3, name: "Alex Chen", score: 150 }
                ],
                solves: [
                    { challenge_id: 101, value: 100 },
                    { challenge_id: 102, value: 200 }
                ]
            },
            {
                id: 36,
                name: "Blue Team Bravo",
                score: 250,
                pos: 2,
                members: [
                    { id: 4, name: "Sarah Johnson", score: 125 }
                ],
                solves: [
                    { challenge_id: 103, value: 125 }
                ]
            },
            {
                id: 37,
                name: "Green Team Charlie",
                score: 200,
                pos: null, // Test null position
                members: [], // Test empty members
                solves: []
            }
        ];
    }

    // Add to your class
    renderMockData() {
        const mockData = this.getMockData();
        let html = '<div class="scoreboard-container">';
        mockData.forEach((team, index) => {
            html += this.renderTeam(team, index);
        });
        html += '</div>';
        return html;
    }
    
    renderTeam(team, index) {
        // Null check for position with fallback to index + 1
        const position = team.pos ?? index + 1;
        
        // Solve count with null protection and unique solve count
        const uniqueUsers = new Set();

        // When processing solves with null protection
        const uniqueSolves = (team.solves || []).filter(solve => {
            if (!solve || !solve.user_id || solve.challenge_id === null) {
                return false;
            }
            if (uniqueUsers.has(solve.user_id)) {
                return false;
            }
            uniqueUsers.add(solve.user_id);
            return true;
        });
        
        // Protected solve count
        const solveCount = uniqueSolves.length;
        
        // Null check for score with fallback to 0
        team.score = team.score ?? 0;

        // Members with empty array fallback
        const members = team.members || [];
    
        return `
        <div class="team" data-team-id="${team.id}">
            <div class="team-header">
                <span class="position">#${position}</span>
                <span class="name">${team.name}</span>
                <div class="solves-count">${solveCount} ${solveCount === 1 ? 'solve' : 'solves'} ${team.score} pts</div>
            </div>
            ${members.length > 0 ? `
            <div class="members" style="display: none;">
                ${members.map(member => `
                    <div class="member">
                        <span class="member-name">${member.name ?? 'Anonymous'}</span>
                        <span class="member-score">${member.score ?? 0}</span>
                    </div>
                `).join('')}
            </div>` : ''}
        </div>`;
    }

    startAutoUpdate() {
        this.updateScoreboard(); // Initial update
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        // Set up periodic updates
        this.updateInterval = setInterval(() => {
            this.updateScoreboard();
        }, CONFIG.UPDATE_INTERVAL);
    }
    
    // Add cleanup method
    stopAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }

    // Function to fetch scoreboard data -- and catch errors  
    async fetchScoreboard() {
        // Validate configuration
        console.log('CONFIG at initialization:', CONFIG);
        console.log('Fetching scoreboard data...');
        
        if (!CONFIG?.API_URL) {
            throw new Error('API URL is not defined in config.js');
        }
    
        try {
            const response = await fetch(CONFIG.API_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${CONFIG.API_TOKEN}`,
                    'Accept': 'application/json'
                },
                mode: 'cors',
            });


            // Add CORS proxy for development
            //const response = await fetch(`https://cors-anywhere.herokuapp.com/${CONFIG.API_URL}`, {
    
            // Handle HTTP errors
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || `HTTP error! status: ${response.status}`);
            }
    
            // Validate content type
            const contentType = response.headers.get('content-type');
            if (!contentType?.includes('application/json')) {
                throw new Error("Invalid content type received");
            }
    
            const data = await response.json();
    
            console.log('Data received:', data);

            // Validate response structure
            if (!data?.success || !Array.isArray(data.data)) {
                throw new Error("Invalid API response structure");
            }
    
            return data.data.map(team => ({
                id: team.account_id,
                name: team.name,
                score: team.score,
                pos: team.pos,
                members: team.members || [] // Add default empty array
            }));

        } catch (error) {
            console.error('Scoreboard Fetch error:', error);
            this.showError(error.message);
            
            console.log('Loading mock data...');
            this.isLoading = false;
            // Fallback to mock data
            return data.data || this.getMockData();
        }
    }

    // Function to update the scoreboard
    async updateScoreboard() {
        if (this.isLoading) return;
        this.isLoading = true;
        this.showLoading();

        try {
            const responseData = await this.fetchScoreboard();
            const data = responseData || this.getMockData();
    
            // Open scoreboard-container
            let html = '<div class="scoreboard-container">';
            data.forEach((team, index) => {
                html += this.renderTeam(team, index);
            });

            const now = new Date();
            const timestamp = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                hour12: true 
            }).toLowerCase();
            
            // Add to scoreboard-container
            html += `
                <div class="last-updated">
                    <span class="timestamp-label">Last updated:</span>
                    <span class="timestamp-value">${timestamp}</span>
                </div>
            `;
            html += '</div>'; // Close scoreboard-container

            this.container.innerHTML = html;
            this.setupTeamInteractions();
            this.lastUpdate = now;

            console.log('Scoreboard updated successfully.');
        } catch (error) {
            console.error('Update error:', error);
            this.showError(error.message);
            
            // Render mock data WITH timestamp
            const now = new Date();
            const timestamp = now.toLocaleTimeString('en-US', { 
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }).toLowerCase();
            
            this.container.innerHTML = `
                <div class="scoreboard-container">
                    ${this.renderMockData()}
                    <div class="last-updated">
                        <span class="timestamp-label">Last updated:</span>
                        <span class="timestamp-value">${timestamp}</span>
                    </div>
                </div>
            `;
        } finally {
            this.isLoading = false;
        }
    }

    retryUpdate() {
        console.log('Retrying scoreboard update...');
        this.updateScoreboard();
    }

    startAutoUpdate() {
        // Initial update
        this.updateScoreboard();
        
        // Clear any existing interval
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        // Set new interval
        this.updateInterval = setInterval(() => {
            this.updateScoreboard();
        }, CONFIG.UPDATE_INTERVAL);

        // Add cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
            }
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.scoreboard = new Scoreboard();

    // Add resize handler to scoreboard.js
    //window.addEventListener('resize', initMatrix);

    // Start auto-update
    scoreboard.startAutoUpdate();
});
