export default function handler(req, res) {
  res.setHeader('Set-Cookie', `adm=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
  res.json({ ok: true });
}
