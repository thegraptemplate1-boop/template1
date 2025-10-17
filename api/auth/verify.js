// /api/auth/verify.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'POST only' });
  }

  // JSON body 파싱
  let body = {};
  try {
    body = req.body || {};
    // Vercel이 JSON으로 넘겨주지만, 혹시 문자열일 경우 대비
    if (typeof body === 'string') body = JSON.parse(body);
  } catch (e) {
    return res.status(400).json({ success: false, error: 'Invalid JSON' });
  }

  const { password } = body;
  if (!password) {
    return res.status(400).json({ success: false, error: 'No password' });
  }

  // Vercel 환경변수와 비교
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: 'Wrong password' });
  }

  // admin.js의 isValidToken()은 payload.exp만 확인하므로
  // 서명 없이 exp만 담긴 "토큰처럼 생긴 문자열"을 만들어 반환합니다.
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 12; // 12시간
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ exp })).toString('base64url');
  const token = `${header}.${payload}.dummy`;

  return res.status(200).json({ success: true, token });
}
