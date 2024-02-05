const express = require('express');
const path = require('path');

class AppRoutes {
    constructor(app, namespaceManager) {
        this.app = app;
        this.namespaceManager = namespaceManager;
    }

    setupRoutes() {
        // Serve the HTML file for the homepage
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../views/index.html'));
        });

        // Create a new namespace
        this.app.post('/create-namespace', async (req, res) => {
            try {
                const namespaceName = req.body.name;
                const result = await this.namespaceManager.createNamespace(namespaceName);
                res.status(200).json({ message: result });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }
        });

        // Delete a namespace
        this.app.delete('/delete-namespace/:name', async (req, res) => {
            try {
                const namespaceName = req.params.name;
                const result = await this.namespaceManager.deleteNamespace(namespaceName);
                res.status(200).json({ message: result });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }
        });

        // List namespaces
        this.app.get('/list-namespaces', async (req, res) => {
            try {
                const namespaces = await this.namespaceManager.listNamespaces();
                res.status(200).json({ namespaces });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }
        });

        // List resources within a selected namespace
        this.app.get('/list-resources/:namespace', async (req, res) => {
            try {
                const namespace = req.params.namespace;
                // Fetch and list resources within the selected namespace using the namespaceManager
                const resources = await this.namespaceManager.listResources(namespace);
                res.status(200).json({ resources });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }
        });
    }
}

module.exports = AppRoutes;
