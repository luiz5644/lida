import { rm } from "node:fs/promises";

const pastas = [
  new URL("../publico/js", import.meta.url),
  new URL("../publico/estilos", import.meta.url),
];

await Promise.all(
  pastas.map((pasta) => rm(pasta, { recursive: true, force: true })),
);

console.log("Saídas anteriores removidas de publico/.");
