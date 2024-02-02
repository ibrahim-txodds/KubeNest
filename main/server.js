const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // for parsing application/json

app.get('/', (req, res) => {
  res.send('Welcome to the Kubernetes Namespace Manager');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();
kc.loadFromDefault(); // Load config from default location (~/.kube/config)

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

app.get('/namespaces', async (req, res) => {
    try {
      const { body } = await k8sApi.listNamespace();
      res.json(body.items.map(ns => ns.metadata.name));
    } catch (error) {
      console.error(error);
      res.status(500).send('Error listing namespaces');
    }
  });
  