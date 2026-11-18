import { cp, mkdir } from "node:fs/promises";

const origem = new URL("../src/apresentacao/estilos", import.meta.url);
const destino = new URL("../publico/estilos", import.meta.url);

await mkdir(destino, { recursive: true });
await cp(origem, destino, { recursive: true });

console.log("Estilos copiados para publico/estilos/.");
