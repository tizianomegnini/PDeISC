// servidor básico sin express
import http from 'http';
import fs from 'fs';
import path from 'path';

// puerto
const PORT = 3000;

// creo servidor
const server = http.createServer((req, res) => {

    // ruta base
    let filePath = '.' + req.url;

    if (filePath === './') {
        filePath = './pag/index.html';
    }

    // saco extensión
    const ext = path.extname(filePath);

    // tipos de contenido
    let contentType = 'text/html';

    if (ext === '.js') contentType = 'text/javascript';
    if (ext === '.css') contentType = 'text/css';

    // leo archivo
    fs.readFile(filePath, (err, content) => {

        if (err) {
            res.writeHead(404);
            res.end('Archivo no encontrado');
            return;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
});

// levanto servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});