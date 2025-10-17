// /api/save-content.js
async function getCurrentSha(repo, path, token, branch) {
  const url = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(path)}?ref=${branch}`;
  const r = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github+json' }
  });
  if (r.status === 404) return null;
  const j = await r.json();
  return j.sha || null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'POST only' });

  try {
    const content = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!content) return res.status(400).json({ success: false, message: 'no content' });

    const repo = process.env.GH_REPO;
    const branch = process.env.GH_BRANCH;
    const token = process.env.GITHUB_TOKEN;

    const path = 'content.json';
    const sha = await getCurrentSha(repo, path, token, branch);

    const putUrl = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(path)}`;
    const fileContentBase64 = Buffer.from(JSON.stringify(content, null, 2), 'utf-8').toString('base64');

    const resp = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'chore(cms): update content.json',
        content: fileContentBase64,
        branch,
        sha // 기존 파일 덮어쓸 때 필요(신규 생성이면 null 가능)
      })
    });

    const json = await resp.json();
    if (!resp.ok) {
      return res.status(resp.status).json({ success: false, message: json.message || 'save failed' });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}
