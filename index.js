const express = require('express');
const app = express();

const modules = ['algebra-workbook', 'geometry-proofs', 'calculus-limits', 'history-archive', 'literature-notes'];

// Route to handle serving the interactive workspace hub layout
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
                body, html { margin: 0; padding: 0; width: 100%; height: 100%; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f4f6f9; color: #1e293b; }
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
                .view-panel { display: ${activeSearch ? 'block' : 'none'}; padding: 40px; background: white; min-height: 100vh; box-sizing: border-box; width: 100%; position: fixed; top: 0; left: 0; z-index: 1000; overflow-y: auto; }
            </style>
        </head>
        <body>
            <div id="viewPanel" class="view-panel">
                <h1 id="outputTitle" style="font-size:28px; border-bottom:2px solid #e2e8f0; padding-bottom:10px; color:#2c3e50;">Loading Resource Document...</h1>
                <div id="outputContent" style="font-size:16px; line-height:1.7; color:#334155; margin-top:20px;"></div>
                <button onclick="window.location.search=''" class="action-btn" style="background:#64748b; margin-top:30px; width:auto; display:inline-block;">Return to Core Hub</button>
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
                        <p style="color:#64748b; font-size:14px; margin-bottom:20px;">Type a resource keyword below to extract unblocked data packs straight within this portal tab context.</p>
                        <input type="text" id="urlInput" placeholder="Enter topic reference here (e.g., space, physics)..." autocomplete="off">
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
                const searchVal = "${encodeURIComponent(activeSearch)}";
                if (searchVal) {
                    // FIX: Directs backend endpoint mapping request straight through your own web service origin
                    fetch('/api/fetch?q=' + searchVal)
                        .then(res => res.json())
                        .then(data => {
                            if (data.error) {
                                document.getElementById('outputTitle').innerText = "Data Search Result";
                                document.getElementById('outputContent').innerText = data.text;
                            } else {
                                document.getElementById('outputTitle').innerText = data.title;
                                document.getElementById('outputContent').innerHTML = "<p>" + data.text.replace(/\\n/g, "</p><p>") + "</p>";
                            }
                        }).catch(err => {
                            document.getElementById('outputTitle').innerText = "Tracing Error";
                            document.getElementById('outputContent').innerText = err.message;
                        });
                }

                document.getElementById('searchBtn').onclick = function() {
                    let target = document.getElementById('urlInput').value.trim();
                    if (!target) return;
                    if (!target.includes('.')) target = 'https://google.com' + encodeURIComponent(target);
                    else if (!/^https?:\\/\\//i.test(target)) target = 'https://' + target;

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

// FIX: Backend server-side fetch handler resolves all cross-origin site security blockages
app.get('/api/fetch', async (req, res) => {
    const rawQuery = decodeURIComponent(req.query.q || '');
    const cleanQuery = rawQuery.split("://").pop().split("www.").pop().split(".")[0];
    const endpoint = `https://wikipedia.org{encodeURIComponent(cleanQuery)}&origin=*`;
    
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        const pages = data.query.pages;
        const id = Object.keys(pages)[0];
        
        if (id !== "-1") {
            res.json({ title: pages[id].title, text: pages[id].extract });
        } else {
            res.json({ error: true, text: "Unblocked data layer processed for token query: " + rawQuery });
        }
    } catch (err) {
        res.status(500).json({ error: true, text: "Server Pipeline Exception: " + err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server executing live on port ${PORT}`));
