import http from 'http';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const server = http.createServer(async (req, res) => {
    const { method, url } = req;

    if (method === 'GET') {
        let filePath = url === '/' ? path.join(__dirname, 'pag', 'index.html') : path.join(__dirname, url);
        try {
            const content = await readFile(filePath);
            const ext = path.extname(filePath);
            const contentType = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }[ext] || 'text/plain';
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        } catch {
            res.writeHead(404);
            res.end('Not Found');
        }
        return;
    }

    if (method === 'POST' && url === '/exportar-filtrado') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            try {
                const { reporte } = JSON.parse(body);
                const fileName = 'reporte_filtrado.txt';
                await writeFile(fileName, reporte);
                
                res.writeHead(200, { 
                    'Content-Type': 'text/plain',
                    'Content-Disposition': `attachment; filename=${fileName}` 
                });
                res.end(reporte);
            } catch {
                res.writeHead(400);
                res.end(JSON.stringify({ message: 'Error al exportar' }));
            }
        });
    }
});

server.listen(3001, () => console.log('🚀 Proyecto 2 en http://localhost:3001'));