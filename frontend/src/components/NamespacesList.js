// frontend/src/components/NamespacesList.js
import React, { useEffect, useState } from 'react';
import { listNamespaces } from '../services/api';

const NamespacesList = () => {
  const [namespaces, setNamespaces] = useState([]);

  useEffect(() => {
    listNamespaces().then(setNamespaces);
  }, []);

  return (
    <div>
      <h2>Namespaces</h2>
      <ul>
        {namespaces.map((ns, index) => (
          <li key={index}>{ns}</li>
        ))}
      </ul>
    </div>
  );
};

export default NamespacesList;
