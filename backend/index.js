const express = require('express');
const k8s = require('@kubernetes/client-node');
const app = express();
const port = 3000;

// Initialize Kubernetes client
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

app.use(express.json());

// Serve an HTML page with various functionalities
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Kubernetes Namespace Manager</title>
            </head>
            <body>
                <h1>Welcome to the Kubernetes Namespace Manager</h1>
                
                <h2>Create Namespace</h2>
                <input type="text" id="createNamespaceName" placeholder="Namespace Name">
                <button id="createNamespace">Create Namespace</button>

                <h2>Delete Namespace</h2>
                <select id="deleteNamespaceDropdown">
                    <option value="">Select a Namespace to Delete</option>
                </select>
                <button id="deleteNamespace">Delete Namespace</button>
                
                <h2>List Namespaces</h2>
                <select id="namespaceDropdown">
                    <option value="">Select a Namespace</option>
                </select>
                <button id="viewResources">View Resources</button>
                <div id="resourceList"></div>
                
                <script>
                    document.addEventListener('DOMContentLoaded', function() {
                        fetch('/list-namespaces')
                            .then(response => response.json())
                            .then(data => {
                                const namespaceDropdown = document.getElementById('namespaceDropdown');
                                const deleteNamespaceDropdown = document.getElementById('deleteNamespaceDropdown');
                                data.namespaces.forEach(ns => {
                                    const option = new Option(ns, ns);
                                    const deleteOption = option.cloneNode(true);
                                    namespaceDropdown.add(option);
                                    deleteNamespaceDropdown.add(deleteOption);
                                });
                            })
                            .catch(error => console.error('Error:', error));
                    });

                    document.getElementById('viewResources').onclick = function() {
                        const namespace = document.getElementById('namespaceDropdown').value;
                        fetch(\`/list-resources/\${namespace}\`)
                            .then(response => response.json())
                            .then(data => {
                                const list = document.getElementById('resourceList');
                                list.innerHTML = '<ul>' + data.podNames.map(name => '<li>' + name + '</li>').join('') + '</ul>';
                            })
                            .catch(error => console.error('Error:', error));
                    };

                    document.getElementById('createNamespace').onclick = function() {
                        const name = document.getElementById('createNamespaceName').value;
                        fetch('/create-namespace', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ name: name })
                        })
                        .then(response => response.json())
                        .then(data => {
                            alert(data.message);
                            window.location.reload(); // Reload to update the namespace list
                        })
                        .catch(error => console.error('Error:', error));
                    };

                    document.getElementById('deleteNamespace').onclick = function() {
                        const name = document.getElementById('deleteNamespaceDropdown').value;
                        fetch(\`/delete-namespace/\${name}\`, { method: 'DELETE' })
                        .then(response => response.json())
                        .then(data => {
                            alert(data.message);
                            window.location.reload(); // Reload to update the namespace list
                        })
                        .catch(error => console.error('Error:', error));
                    };
                </script>
            </body>
        </html>
    `);
});

// Route to list namespaces
app.get('/list-namespaces', async (req, res) => {
    try {
        const response = await k8sApi.listNamespace();
        const namespaces = response.body.items.map(ns => ns.metadata.name);
        res.status(200).json({ namespaces });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.toString() });
    }
});

// Route to list pods in a specific namespace
app.get('/list-resources/:namespace', async (req, res) => {
    try {
        const namespace = req.params.namespace;
        const pods = await k8sApi.listNamespacedPod(namespace);
        const podNames = pods.body.items.map(pod => pod.metadata.name);
        res.status(200).json({ podNames });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.toString() });
    }
});

// Route to create a namespace
app.post('/create-namespace', async (req, res) => {
    const namespaceName = req.body.name;
    if (!namespaceName) {
        return res.status(400).json({ error: 'Namespace name is required' });
    }
    try {
        const namespace = {
            metadata: {
                name: namespaceName
            }
        };
        await k8sApi.createNamespace(namespace);
        res.status(200).json({ message: `Namespace ${namespaceName} created successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.toString() });
    }
});

// Route to delete a namespace
app.delete('/delete-namespace/:name', async (req, res) => {
    const namespaceName = req.params.name;
    try {
        await k8sApi.deleteNamespace(namespaceName, {});
        res.status(200).json({ message: `Namespace ${namespaceName} deleted successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.toString() });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
