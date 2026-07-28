const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Allow unrestricted data streaming across our cloud proxy lanes
app.use(cors());

// Serve the master interactive search interface on the home path
app.get('/', (req, res) => {
    const activeAssignment = req.query.assignment || '';
    const activeSearch = req.query.q || '';

    let bannerStyle = "display: none;";
    let bannerText = "";
    let headerText = "General Database Search Gateway";

    if (activeAssignment) {
        bannerStyle = "display: inline-block;";
        bannerText = `Active Session: ${activeAssignment.toUpperCase()}`;
        headerText = `Research Module: ${activeAssignment.replace(/-/g, ' ').toUpperCase()}`;
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Student Workspace Portal - Academic Database</title>
            <style>
                body, html { margin: 0; padding: 0; width: 100%; height: 100%; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f4f6f9; color: #1e293b; overflow: hidden; }
                .app-container { display: flex; min-height: 100vh; width: 100%; }
                .sidebar { width: 260px; background: #2c3e50; color: white; display: flex; flex-direction: column; padding: 20px; box-sizing: border-box; border-right: 1px solid rgba(255,255,255,0.1); }
                .school-logo { font-size: 18px; font-weight: 800; letter-spacing: 0.5px; padding-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 20px; }
                .nav-item { padding: 12px 15px; border-radius: 6px; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.8); }
                .nav-item.active { background: #34495e; color: white; }
                .main-content { flex: 1; padding: 40px; box-sizing: border-box; overflow-y: auto; display: flex; flex-direction: column; gap: 30px; }
                .header-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; position: relative; overflow: hidden; }
                .header-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: #0070f3; }
                .status-badge { display: ${activeAssignment ? 'inline-block' : 'none'}; padding: 4px 12px; font-size: 12px; font-weight: 700; border-radius: 20px; background: #dcfce7; color: #15803d; margin-bottom: 12px; text-transform: uppercase; }
                .card-title { margin: 0 0 8px 0; font-size: 24px; color: #2c3e50; }
                .tool-box { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px; }
                input[type="text"] { width: 100%; padding: 14px 16px; font-size: 15px; border: 1px solid #e2e8f0; border-radius: 8px; box-sizing: border-box; margin-bottom: 20px; outline: none; background: #f8fafc; color: #1e293b; }
                input[type="text"]:focus { border-color: #0070f3; background: white; }
                .action-btn { display: block; padding: 14px 24px; font-size: 15px; background: #0070f3; color: white; border: none; border-radius: 8px; cursor: pointer; width: 100%; font-weight: 600; box-sizing: border-box; text-align: center; }
                .bot-btn { background: #1e293b; margin-top: 10px; }
                #result-link { margin-top: 25px; padding: 15px; background: #f0f7ff; border: 1px solid #bae7ff; border-radius: 8px; display: none; word-break: break-all; font-size: 14px; }
                .view-panel { display: ${activeSearch ? 'block' : 'none'}; width: 100%; height: 100%; border: none; box-sizing: border-box; position: fixed; top: 0; left: 0; z-index: 1000; background: #fff; }
                iframe { width: 100%; height: 100%; border: none; margin: 0; padding: 0; }
            </style>
        </head>
        <body>
            <!-- Dynamic Web Proxy Frame Layer -->
            <div id="viewPanel" class="view-panel">
                <iframe src="/service/${encodeURIComponent(activeSearch)}"></iframe>
            </div>

            <div id="mainUI" class="app-container">
                <div class="sidebar">
                    <div class="school-logo">CampusWorkspace</div>
                    <div class="nav-item active">Assignment Core</div>
                    <div class="nav-item">Course Modules</div>
                    <div class="nav-item">Grade Book</div>
                </div>
                <div class="main-content">
                    <div class="header-card">
                        <div class="status-badge">${bannerText}</div>
                        <h1 class="card-title">${headerText}</h1>
                    </div>
                    <div class="tool-box">
                        <h3>External Research Engine Tunnel</h3>
                        <p style="color:#64748b; font-size:14px; margin-bottom:20px;">Type any URL or website destination below to launch an unblocked proxy mirror inside this tab container workspace.</p>
                        <input type="text" id="urlInput" placeholder="Enter any site URL here (e.g., wikipedia.org, google.com)..." autocomplete="off">
                        <button class="action-btn" id="searchBtn">Execute Research Pipeline</button>
                    </div>
                    <div class="tool-box">
                        <h3>Proxy Dispenser Bot</h3>
                        <button class="action-btn bot-btn" id="cloneBtn">Replicate Workspace Node</button>
                        <div id="result-link"></div>
                    </div>
                </div>
            </div>
            <script>
                document.getElementById('searchBtn').onclick = function() {
                    let target = document.getElementById('urlInput').value.trim();
                    if (!target) return;
                    
                    // Formulate standard search indexing paths for plain text keywords vs domains
                    if (!target.includes('.')) {
                        target = 'https://google.com' + encodeURIComponent(target);
                    } else if (!/^https?:\\/\\//i.test(target)) {
                        target = 'https://' + target;
                    }

                    const subs = ['algebra-workbook', 'geometry-proofs', 'calculus-limits', 'history-archive'];
                    const randomSubject = subs[Math.floor(Math.random() * subs.length)] + '-' + Math.floor(1000 + Math.random() * 9999);
                    window.location.href = '/?assignment=' + randomSubject + '&q=' + encodeURIComponent(target);
                };

                document.getElementById('cloneBtn').onclick = function() {
                    const div = document.getElementById('result-link');
                    div.style.display = "block";
                    const subs = ['algebra-workbook', 'geometry-proofs', 'calculus-limits', 'history-archive'];
                    const randomSubject = subs[Math.floor(Math.random() * subs.length)] + '-' + Math.floor(1000 + Math.random() * 9999);
                    const newLink = window.location.origin + '/?assignment=' + randomSubject;
                    div.innerHTML = '<strong>Generated Node Link:</strong><br><br><a href="' + newLink + '" target="_self" style="color:#0070f3; font-weight:bold; text-decoration:none;">' + newLink + '</a>';
                };
            </script>
        </body>
        </html>
    `);
});

// TRUE BACKEND RE-ROUTING GATEWAY (Intercerts and streams the ENTIRE live internet natively)
app.get('/service/:url', async (req, res) => {
    let targetUrl = decodeURIComponent(req.params.url);
    if (!targetUrl) return res.status(400).send("No target site URL specified.");

    try {
        const urlObj = new URL(targetUrl);
        
        // Formulate standard headers array to spoof target site filters
        const options = {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        };

        // Fetch the raw internet asset data directly on the server-side to neutralize client-side firewalls
        const response = await fetch(targetUrl, options);
        let htmlContent = await response.text();

        // DEFEAT SAME-ORIGIN SECURITY: Inject an internal base path tag so the site fetches assets from itself
        const injectionBase = `<head><base href="${urlObj.origin}/">`;
        htmlContent = htmlContent.replace(/<head>/i, injectionBase);

        // Strip content validation script tags that cause layout breaking or tracking
        htmlContent = htmlContent.replace(/content-security-policy/gi, 'disabled-csp');

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(htmlContent);

    } catch (err) {
        res.status(500).send(`<h3>Proxy Server Connection Timeout:</h3><p>${err.message}</p>`);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy Node Network operating live on port ${PORT}`));
