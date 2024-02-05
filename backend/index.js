const express = require('express');
const k8s = require('@kubernetes/client-node');
const app = express();
const port = 3000;

// Initialize Kubernetes client
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

app.use(express.json());

app.get('/list-namespaces', async (req, res) => {
    try {
        const response = await k8sApi.listNamespace();
        const namespaces = response.body.items.map(ns => ns.metadata.name);
        res.status(200).json({ namespaces: namespaces });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.toString() });
    }
});


// Serve an HTML page with a button at the root
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Kubernetes Namespace Manager</title>
            </head>
            <body>
                <h1>Welcome to the Kubernetes Namespace Manager</h1>
                <button id="listNamespaces">List Namespaces</button>
                <div id="namespaceList"></div>
                <script>
                    document.getElementById('listNamespaces').onclick = function() {
                        fetch('/list-namespaces')
                            .then(response => response.json())
                            .then(data => {
                                const list = document.getElementById('namespaceList');
                                list.innerHTML = '<ul>' + data.namespaces.map(ns => '<li>' + ns + '</li>').join('') + '</ul>';
                            })
                            .catch(error => console.error('Error:', error));
                    };
                </script>
            </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
