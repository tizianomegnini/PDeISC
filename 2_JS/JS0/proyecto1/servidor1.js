import http from "http";
import fs from "fs";
import path from "path";

const puerto = 3000;

const servidor = http.createServer((req, res) => {

    console.log("URL:", req.url); // para debug

    let archivo = req.url === "/" 
        ? "./pags/ejercicio1.html"
        : path.join(".", req.url);

    const ext = path.extname(archivo);

    const tipos = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css"
    };

    fs.readFile(archivo, (err, data) => {
        if (err) {
            console.log("ERROR:", archivo);
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
    console.log("Servidor corriendo en http://localhost:3000");
});