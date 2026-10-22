import test from 'node:test';
import assert from 'node:assert/strict';

test('la lista de estados contiene los estados principales del flujo', async () => {
  const source = await import('node:fs/promises');
  const text = await source.readFile(new URL('../src/controllers/repairController.js', import.meta.url),'utf8');
  for (const status of ['Solicitud recibida','En diagnóstico','Presupuestada','En reparación','Entregada','Cancelada']) {
    assert.ok(text.includes(status), `Falta el estado ${status}`);
  }
});
