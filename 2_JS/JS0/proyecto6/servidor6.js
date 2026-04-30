import http from "http";
import fs from "fs";
import path from "path";

const puerto = 3005;

const servidor = http.createServer((req, res) => {

    let archivo = req.url === "/" 
        ? "./pags/ejercicio6.html"
        : path.join(".", req.url);

    const ext = path.extname(archivo);

    const tipos = {
        ".html": "text/html",
        ".js": "text/javascript"
    };

    fs.readFile(archivo, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end("No encontrado");
        } else {
            res.writeHead(200, {
                "Content-Type": (tipos[ext] || "text/plain") + "; charset=utf-8"
            });
            res.end(data);
        }
    });
});

servidor.listen(puerto, () => {
    console.log("http://localhost:3005");
});