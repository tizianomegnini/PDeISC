import bcrypt from "bcryptjs";
import readline from "node:readline";

/**
 * Uso: npm run hash-password
 * Pide una contraseña por consola y devuelve su hash con bcrypt, listo
 * para pegar en la variable de entorno ADMIN_PASSWORD_HASH.
 */
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question("Escribí la contraseña de admin que querés usar: ", (password) => {
  const hash = bcrypt.hashSync(password, 10);
  console.log("\nCopiá esta línea en tu archivo .env (o en las variables de entorno del host):\n");
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
  rl.close();
});
