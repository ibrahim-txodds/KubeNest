const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to log requests with large headers
app.use((req, res, next) => {
    const totalHeaderSize = Object.keys(req.headers).reduce((acc, key) => acc + req.headers[key].length, 0);
    console.log(`Total Header Size: ${totalHeaderSize} bytes`);
    // Example threshold: 8000 bytes (8 KB), adjust as necessary
    if (totalHeaderSize > 8000) {
        console.warn('Large headers detected');
        // Optionally, you can choose to send a custom response here or allow the request to proceed
        // res.status(431).send('Header too large');
    }
    next();
});

app.use(express.json());

app.get('/', (req, res) => res.send('KubeNest Backend is running!'));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
