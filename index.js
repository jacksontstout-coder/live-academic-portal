const express = require('express');
const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const server = http.createServer(app);

// Educational assignment modules array for dynamic URL mask generation
const modules = ['algebra-workbook', 'geometry-proofs', 'calculus-limits', 'history-archive', 'literature-notes'];

// Serve the interactive search panel interface directly on the home URL path
app.get('/', (req, res) => {
    const activeAssignment = req.query.assignment || '';
    const activeSearch = req.query.q || '';

    let bannerStyle = "display: none;";
    let bannerText = "";
    let headerText = "General Database Search Gateway";

    if (activeAssignment) {
        bannerStyle = "display: block;";
        bannerText = `📚 ACTIVE STUDY SESSION: ${activeAssignment.toUpperCase()}`;
        headerText = `Research Module: ${activeAssignment.replace(/-/g, ' ').toUpperCase()}`;
    }

    // Direct interface injection logic
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Student Workspace Portal - Academic Database</title>
            <style>
                body, html { margin: 0; padding: 0; width: 100%; height: 100%; font-family: sans-serif; background: #f4f6f9; color: #1e293b; }
                .app-container { display: flex; min-height: 100vh; width: 100%; }
                .sidebar { width: 260px; background: #2c3e50; color: white; display: flex; flex-direction: column; padding: 20px; box-sizing: border-box; }
                .school-logo { font-size: 18px; font-weight: 800; padding-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 20px; }
                .nav-item { padding: 12px 15px; border-radius: 6px; margin-bottom: 8px; font-size: 14px; color: rgba(255,255,255,0.8); }
                .nav-item.active { background: #34495e; color: white; }
                .main-content { flex: 1; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; gap: 30px; }
                .header-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; position: relative; overflow: hidden; }
                .header-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: #0070f3; }
                .status-badge { display: inline-block; padding: 4px 12px; font-size: 12px; font-weight: 700; border-radius: 20px; background: #e0f2fe; color: #0369a1; margin-bottom: 12px; }
                .tool-box { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px; }
                input[type="text"] { width: 100%; padding: 14px 16px; font-size: 15px; border: 1px solid #e2e8f0; border-radius: 8px; box-sizing: border-box; margin-bottom: 20px; outline: none; background: #f8fafc; }
                button { display: block; padding: 14px 24px; font-size: 15px; background: #0070f3; color: white; border: none; border-radius: 8px; cursor: pointer; width: 100%; font-weight: 600; }
                .bot-btn { background: #1e293b; margin-top: 10px; }
                #result-link { margin-top: 25px; padding: 15px; background: #f0f7ff; border: 1px solid #bae7ff; border-radius: 8px; display: none; word-break: break-all; }
                .frame-container { width: 100%; height: 100%; border: none; display: ${activeSearch ? 'block' : 'none'}; position: fixed; top: 0; left: 0; z-index: 100; background: #fff; }
                iframe { width: 100%; height: 100%; border: none; }
            </style>
        </head>
        <body>
            <div class="frame-container">
                <iframe src="/proxy/${encodeURIComponent(activeSearch)}"></iframe>
            </div>
            <div class="app-container">
                <div class="sidebar">
                    <div class="school-logo">CampusWorkspace</div>
                    <div class="nav-item active">Assignment Core</div>
                    <div class="nav-item">Course Modules</div>
                    <div class="nav-item">Grade Book</div>
                </div>
                <div class="main-content">
                    <div class="header-card">
                        <div class="status-badge" style="${bannerStyle}">${bannerText || 'Awaiting Initialization'}</div>
                        <h1 class="card-title">${headerText}</h1>
                    </div>
                    <div class="tool-box">
                        <h3>External Research Engine Tunnel</h3>
                        <input type="text" id="urlInput" placeholder="Enter target website URL here (e.g., wikipedia.org)...">
                        <button id="searchBtn">Execute Research Pipeline</button>
                    </div>
                    <div class="tool-box">
                        <h3>Proxy Dispenser Bot</h3>
                        <button class="bot-btn" id="cloneBtn">Replicate Workspace Node</button>
                        <div id="result-link"></div>
                    </div>
                </div>
            </div>
            <script>
                document.getElementById('searchBtn').onclick = function() {
                    let target = document.getElementById('urlInput').value.trim();
                    if (!target) return;
                    if (!target.includes('.')) target = 'https://google.com' + encodeURIComponent(target);
                    else if (!/^https?:\\/\\//i.test(target)) target = 'https://' + target;

                    const subs = ['algebra-workbook', 'geometry-proofs', 'calculus-limits', 'history-archive'];
                    const randSub = subs[Math.floor(Math.random() * subs.length)] + '-' + Math.floor(1000 + Math.random() * 9999);
                    window.location.href = '/?assignment=' + randSub + '&q=' + encodeURIComponent(target);
                };

                document.getElementById('cloneBtn').onclick = function() {
                    const div = document.getElementById('result-link');
                    div.style.display = "block";
                    const subs = ['algebra-workbook', 'geometry-proofs', 'calculus-limits', 'history-archive'];
                    const randSub = subs[Math.floor(Math.random() * subs.length)] + '-' + Math.floor(1000 + Math.random() * 9999);
                    const newLink = window.location.origin + '/?assignment=' + randSub;
                    div.innerHTML = '<strong>Generated Node Link:</strong><br><br><a href="' + newLink + '" target="_self" style="color:#0070f3; font-weight:bold; text-decoration:none;">' + newLink + '</a>';
                };
            </script>
        </body>
        </html>
    `);
});

// The backend proxy tunnel middleware component that safely strips cross-origin site security blocks
app.use('/proxy/:url', (req, res, next) => {
    const targetUrl = decodeURIComponent(req.params.url);
    try {
        const urlObj = new URL(targetUrl);
        createProxyMiddleware({
            target: urlObj.origin,
            changeOrigin: true,
            pathRewrite: { '^/proxy/.*': urlObj.pathname + urlObj.search },
            onProxyRes: function(proxyRes) {
                // Deletes the exact headers responsible for freezing screens and causing white canvases
                delete proxyRes.headers['x-frame-options'];
                delete proxyRes.headers['content-security-policy'];
            }
        })(req, res, next);
    } catch (e) {
        res.status(400).send("Invalid target URL string calculation.");
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server executing live on port ${PORT}`));
