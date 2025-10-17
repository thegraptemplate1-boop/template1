// /api/upload.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'POST only' });

  try {
    const { name, type, data } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!name || !type || !data) {
      return res.status(400).json({ success: false, message: 'name/type/data required' });
    }

    const repo = process.env.GH_REPO;      // e.g. "thegraptemplate1-boop/template1"
    const branch = process.env.GH_BRANCH;  // e.g. "main"
    const token = process.env.GITHUB_TOKEN;

    // 파일 이름을 안전하게 변환
    const safeName = name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const ts = Date.now();
    const path = `uploads/${ts}-${safeName}`;

    // GitHub contents API: PUT /repos/{owner}/{repo}/contents/{path}
    const putUrl = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(path)}`;

    const resp = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `chore(cms): upload ${safeName}`,
        content: data,     // base64 인코딩 문자열
        branch
      })
    });

    const json = await resp.json();
    if (!resp.ok) {
      return res.status(resp.status).json({ success: false, message: json.message || 'GitHub upload failed' });
    }

    // 배포 후에는 /uploads/... 로 접근됨
    // 즉시 미리보기를 위해 GitHub raw URL도 같이 반환
    const rawUrl = json.content?.download_url || `https://raw.githubusercontent.com/${repo}/${branch}/${path}`;
    const siteUrl = `/uploads/${ts}-${safeName}`;

    return res.status(200).json({ success: true, url: siteUrl, rawUrl });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}
