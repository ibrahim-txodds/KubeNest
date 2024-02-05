class AppRoutes {
    constructor(app, namespaceManager) {
        this.app = app;
        this.namespaceManager = namespaceManager;
    }

    setupRoutes() {
        this.app.get('/', (req, res) => {
            // Serve the HTML page with buttons and scripts (omitted for brevity)
        });

        this.app.get('/list-namespaces', async (req, res) => {
            try {
                const namespaces = await this.namespaceManager.listNamespaces();
                res.status(200).json({ namespaces });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }
        });

        this.app.post('/create-namespace', async (req, res) => {
            try {
                const message = await this.namespaceManager.createNamespace(req.body.name);
                res.status(200).json({ message });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }
        });

        this.app.delete('/delete-namespace/:name', async (req, res) => {
            try {
                const message = await this.namespaceManager.deleteNamespace(req.params.name);
                res.status(200).json({ message });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }
        });
    }
}
