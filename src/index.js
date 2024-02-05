const express = require('express');
const { KubeConfig, CoreV1Api } = require('@kubernetes/client-node');
const KubernetesNamespaceManager = require('./classes/KubernetesNamespaceManager');
const AppRoutes = require('./classes/AppRoutes');

const app = express();
const port = 3000;

const kc = new KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(CoreV1Api);

const namespaceManager = new KubernetesNamespaceManager(k8sApi);
const appRoutes = new AppRoutes(app, namespaceManager);

app.use(express.json());
appRoutes.setupRoutes();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
