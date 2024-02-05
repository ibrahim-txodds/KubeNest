class KubernetesNamespaceManager {
    constructor(k8sApi) {
        this.k8sApi = k8sApi;
    }

    async listNamespaces() {
        try {
            const response = await this.k8sApi.listNamespace();
            return response.body.items.map(ns => ns.metadata.name);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async createNamespace(namespaceName) {
        try {
            const namespace = { metadata: { name: namespaceName } };
            await this.k8sApi.createNamespace(namespace);
            return `Namespace ${namespaceName} created successfully`;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteNamespace(namespaceName) {
        try {
            await this.k8sApi.deleteNamespace(namespaceName, {});
            return `Namespace ${namespaceName} deleted successfully`;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = KubernetesNamespaceManager;
