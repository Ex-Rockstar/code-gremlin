const vscode = require('vscode');

let roastedErrors = new Map(); 

function activate(context) {
    const gremlinRoasts = [
        "Bold of you to save… as if this code deserves it.",
        "You saved? Babe, the bug is still there.",
        "This code slaps… the runtime in the face.",
        "I've seen toddlers debug better.",
        "Are you coding or summoning demons?",
        "You write code like you're speed-running suffering.",
        "Your indentation? Criminal.",
        "Who taught you this? Your nightmares?",
        "This function is crying for help.",
        "Your variables have trust issues.",
        "Don't worry, the compiler will reject this too.",
        "Even ChatGPT would refuse this code.",
        "So many bugs… it's basically an ecosystem.",
        "Your code is giving… ‘please don't deploy me.’",
        "Bruh. Just bruh.",
        "This logic is held together with vibes.",
        "Your code smells. Like burnt RAM.",
        "Did you write this or did fate curse you?",
        "This is why aliens don't talk to us.",
        "I would run this, but I'm scared.",
        "Every time you save, a CPU cries.",
        "You’re typing like someone who hasn’t slept in 3 days.",
        "Your semicolons fear you.",
        "Ah yes, another mistake preserved forever.",
        "I've seen better code in expired GitHub repos.",
        "This code belongs in a museum labeled 'why'.",
        "Congrats, you just created a new bug species.",
        "If StackOverflow could see this, it would crash.",
        "Your brain has disconnected from your fingers.",
        "Babe… no. Just no."
    ];

    const disposable = vscode.languages.onDidChangeDiagnostics(e => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const uri = editor.document.uri.toString();
        const diagnostics = vscode.languages.getDiagnostics(editor.document.uri)
            .filter(d => d.severity === vscode.DiagnosticSeverity.Error);

        if (diagnostics.length === 0) {

            roastedErrors.delete(uri);
            return;
        }

        if (!roastedErrors.has(uri)) roastedErrors.set(uri, new Set());

        const roastedSet = roastedErrors.get(uri);

        
        let newErrors = diagnostics.filter(d => {
            const key = `${d.message}-${d.range.start.line}-${d.range.start.character}`;
            return !roastedSet.has(key);
        });

        if (newErrors.length === 0) return; 


        newErrors.forEach(d => {
            const key = `${d.message}-${d.range.start.line}-${d.range.start.character}`;
            roastedSet.add(key);
        });

        const roast = gremlinRoasts[Math.floor(Math.random() * gremlinRoasts.length)];

        const panel = vscode.window.createWebviewPanel(
            'codeGremlin',
            '🧌 Code Gremlin',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        panel.webview.html = `
            <html>
            <head>
                <style>
                    body {
                        margin: 0;
                        font-family: 'Comic Sans MS', cursive, monospace;
                        background: transparent;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                    }
                    .popup {
                        background: rgba(0,0,0,0.9);
                        color: #ff69b4;
                        padding: 20px 50px;
                        border-radius: 20px;
                        font-size: 2rem;
                        font-weight: bold;
                        text-shadow: 2px 2px 0 #00ffff, -2px -2px 0 #ff0;
                        animation: shake 0.6s, rainbow 1s infinite alternate;
                        transform-origin: center;
                    }
                    @keyframes shake {
                        0% { transform: rotate(0deg); }
                        25% { transform: rotate(3deg); }
                        50% { transform: rotate(-3deg); }
                        75% { transform: rotate(2deg); }
                        100% { transform: rotate(0deg); }
                    }
                    @keyframes rainbow {
                        0% { color: #ff69b4; }
                        20% { color: #ff0; }
                        40% { color: #0f0; }
                        60% { color: #0ff; }
                        80% { color: #00f; }
                        100% { color: #f0f; }
                    }
                </style>
            </head>
            <body>
                <div class="popup">🧌 <b>${roast}</b></div>
                <script>
                    const vscode = acquireVsCodeApi();
                    setTimeout(() => vscode.postMessage({ command: 'close' }), 2500);
                </script>
            </body>
            </html>
        `;

        panel.webview.onDidReceiveMessage(msg => {
            if(msg.command === 'close') panel.dispose();
        });
    });

    context.subscriptions.push(disposable);
    console.log("Code Gremlin activated. ");
}

function deactivate() {}

module.exports = { activate, deactivate };
