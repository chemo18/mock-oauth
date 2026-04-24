require("dotenv").config();
const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const PORT = port;

// Para parsear x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.post('/idm/oauth2/access_token', (req, res) => {
    const mode = req.query.mode;

    console.log('Request recibida:', {
        body: req.body,
        mode
    });

    // 🔴 1. Simular 503 con HTML
    if (mode === '503') {
        return res.status(503)
            .set('Content-Type', 'text/html')
            .send(`
<html>
<body>
<h1>503 Service Unavailable</h1>
No server is available to handle this request.
</body>
</html>
            `);
    }

    // ⏳ 2. Timeout real (no responde nunca)
    if (mode === 'timeout') {
        console.log('Simulando timeout (sin respuesta)...');
        return;
    }

    // 🐢 3. Respuesta lenta (por si quieres provocar timeout del cliente)
    if (mode === 'slow') {
        console.log('Simulando respuesta lenta (30s)...');
        return setTimeout(() => {
            res.json({
                access_token: "l17QZd_35AJY4NuYUg986CpRODE",
                scope: "uid memberof",
                token_type: "Bearer",
                expires_in: 3599
            });
        }, 30000);
    }

    // 🔌 4. Cortar conexión (ECONNRESET)
    if (mode === 'reset') {
        console.log('Simulando conexión cortada...');
        req.socket.destroy();
        return;
    }

    // 🟢 5. Respuesta OK normal
    return res.json({
        access_token: "l17QZd_35AJY4NuYUg986CpRODE",
        scope: "uid memberof",
        token_type: "Bearer",
        expires_in: 3599
    });
});

app.listen(PORT, () => {
    console.log(`Servidor mock OAuth corriendo en http://localhost:${PORT}`);
});
