// src/app/api/analyze/route.js
const TOTAL_MODELS = 17;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function hashString(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) hash = (hash * 31 + input.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

export async function POST(request) {
  let formData;
  try { formData = await request.formData(); }
  catch { return Response.json({ error: 'Expected multipart/form-data with an "image" field' }, { status: 400 }); }

  const file = formData.get('image');
  if (!file || typeof file === 'string') return Response.json({ error: 'Missing "image" file' }, { status: 400 });
  if (file.type && !file.type.startsWith('image/')) return Response.json({ error: 'Only image uploads are supported' }, { status: 415 });

  await delay(1400);

  const seed = hashString(`${file.name}:${file.size}`);
  const isAbnormal = seed % 100 < 55;
  const probability = 0.62 + (seed % 34) / 100;
  const confidence = isAbnormal ? probability : 1 - (1 - probability) * 0.4;
  const votesAbnormal = isAbnormal ? Math.min(TOTAL_MODELS, Math.round(TOTAL_MODELS * probability)) : Math.max(0, Math.round(TOTAL_MODELS * (1 - probability)));

  return Response.json({
    file: file.name,
    prediction: isAbnormal ? 'ABNORMAL' : 'NORMAL',
    probability: Number(probability.toFixed(3)),
    confidence: Number(Math.min(confidence, 0.99).toFixed(3)),
    votes_abnormal: votesAbnormal,
    total_models: TOTAL_MODELS,
    engine: 'mock',
  });
}
