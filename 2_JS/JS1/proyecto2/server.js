import http from "http";
import fs from "fs";

let usuarios = [];

const server = http.createServer((req, res) => {

  // HTML
  if (req.url === "/") {
    fs.readFile("./pag/index.html", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data);
    });
    return;
  }

  // JS
  if (req.url === "/app.js") {
    fs.readFile("./scripts/app.js", (err, data) => {
      res.writeHead(200, { "Content-Type": "application/javascript" });
      res.end(data);
    });
    return;
  }

  // POST
  if (req.url === "/agregar" && req.method === "POST") {
    let body = "";

    req.on("data", chunk => body += chunk);

    req.on("end", () => {
      const usuario = JSON.parse(body);
      usuarios.push(usuario);

      res.writeHead(200);
      res.end("OK");
    });

    return;
  }

  // GET usuarios
  if (req.url === "/usuarios") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(usuarios));
    return;
  }

});

server.listen(3000, () => {
  console.log("http://localhost:3000");
});