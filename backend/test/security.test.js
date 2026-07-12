const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../app");

const obtenerCsrf = async (agent) => {
  const response = await agent.get("/api/security/csrf").expect(200);
  assert.match(response.body.data.csrfToken, /^[a-f0-9]{64}$/);
  return response.body.data.csrfToken;
};

test("incluye encabezados de seguridad HTTP", async () => {
  const response = await request(app).get("/health").expect(200);
  assert.equal(response.headers["x-content-type-options"], "nosniff");
  assert.equal(response.headers["x-frame-options"], "SAMEORIGIN");
  assert.ok(response.headers["content-security-policy"]);
});

test("informa una sesión vacía sin rechazar al visitante público", async () => {
  await request(app).get("/api/auth/me").expect(200, { data: null });
  await request(app).get("/api/admin/me").expect(200, { data: null });
});

test("rechaza rutas administrativas sin sesión", async () => {
  await request(app).get("/api/admin/usuarios").expect(401);
});

test("rechaza mutaciones sin un token CSRF", async () => {
  await request(app)
    .post("/api/auth/login")
    .send({ email: "nadie@example.com", password: "NoValida123!" })
    .expect(403);
});

test("autentica al admin desde SQLite y conserva su sesión", async () => {
  const agent = request.agent(app);
  const csrf = await obtenerCsrf(agent);
  const login = await agent
    .post("/api/auth/login")
    .set("X-CSRF-Token", csrf)
    .send({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD })
    .expect(200);
  assert.equal(login.body.data.role, "admin");
  await agent.get("/api/admin/me").expect(200);
  await agent.get("/api/admin/usuarios").expect(200);
});

test("el listado público de usuarios no está expuesto", async () => {
  await request(app).get("/api/usuarios").expect(404);
});
