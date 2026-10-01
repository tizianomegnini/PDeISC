import { createHash } from "node:crypto";
import readline from "node:readline";

/**
 * Uso: npm run hash-password
 * Pide la contraseña de edición y muestra su SHA-256, listo para pegar en
 * VITE_ADMIN_PASSWORD_HASH (archivo .env y variables de entorno de Vercel).
 */
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question("Escribí la contraseña de edición que querés usar: ", (password) => {
  const hash = createHash("sha256").update(password).digest("hex");
  console.log("\nCopiá esta línea en tu .env y en las variables de entorno de Vercel:\n");
  console.log(`VITE_ADMIN_PASSWORD_HASH=${hash}\n`);
  rl.close();
});
