import http from 'http';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const server = http.createServer(async (req, res) => {
    const { method, url } = req;

    // Manejo de archivos estáticos
    if (method === 'GET') {
        let filePath = url === '/' ? path.join(__dirname, 'pag', 'index.html') : path.join(__dirname, url);
        try {
            const data = await readFile(filePath);
            const ext = path.extname(filePath);
            const type = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }[ext] || 'text/plain';
            res.writeHead(200, { 'Content-Type': type });
            res.end(data);
        } catch {
            res.writeHead(404);
            res.end('No encontrado');
        }
        return;
    }

    // Guardar TXT
    // ... (resto del código igual)

if (method === 'POST' && url === '/guardar') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
        try {
            const { datos } = JSON.parse(body);
            
            // Formateo del contenido
            let contenido = `REPORTE DE DATOS - ${new Date().toLocaleString()}\n`;
            contenido += "=".repeat(30) + "\n";
            datos.forEach((d, i) => {
                contenido += `${i + 1}. Valor: ${d.valor} | Fecha: ${d.fecha}\n`;
            });

            const fileName = 'datos.txt';
            await writeFile(fileName, contenido);

            // Respondemos con el contenido para que el cliente pueda descargarlo
            res.writeHead(200, { 
                'Content-Type': 'text/plain',
                'Content-Disposition': `attachment; filename=${fileName}` 
            });
            res.end(contenido); 
        } catch (err) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Error procesando datos' }));
        }
    });
    return;
  }
});

server.listen(3000, () => console.log('🚀 Server: http://localhost:3000'));