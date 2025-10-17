// /api/verify.js
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, msg: 'POST only' });
  }

  // JSON body 받기
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ ok: false, msg: 'no password' });

  // Vercel 환경변수와 비교
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ ok: false, msg: 'wrong password' });
  }

  // 아주 단순한 세션 쿠키 (필요하면 JWT로 바꿔도 됨)
  const maxAge = 60 * 60 * 12; // 12h
  res.setHeader('Set-Cookie', `adm=ok; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`);

  return res.json({ ok: true });
}
