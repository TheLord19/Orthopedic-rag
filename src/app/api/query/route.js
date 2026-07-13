// src/app/api/query/route.js
const KNOWLEDGE_BASE = [
  {
    keywords: ['acl', 'anterior cruciate'],
    answer: "Based on current orthopedic research, the most effective treatment for ACL tears depends on the patient's activity level and the extent of the injury. For young, active patients, surgical reconstruction using a patellar tendon or hamstring autograft is often recommended, with return-to-sport typically at 9–12 months when guided by objective criteria. For less active patients, structured conservative treatment with progressive physical therapy can achieve comparable functional outcomes.",
    sources: [{ id: 1, title: 'ACL Reconstruction Techniques: A Comprehensive Review', authors: 'Smith, J., Johnson, A., & Williams, R.', journal: 'Journal of Orthopedic Surgery', year: 2023, volume: '15', issue: '2', pages: '112-125', url: '#', relevance: 0.95, excerpt: 'Our meta-analysis of 35 studies found that autograft reconstruction resulted in significantly better outcomes for young athletes compared to allografts or conservative treatment.' }, { id: 2, title: 'Rehabilitation Protocols Following ACL Reconstruction', authors: 'Chen, L., Martinez, K., & Brown, T.', journal: 'Clinical Orthopedics and Related Research', year: 2022, volume: '480', issue: '5', pages: '892-905', url: '#', relevance: 0.87, excerpt: 'Early weight-bearing and controlled motion exercises initiated within the first two weeks post-surgery showed improved range of motion outcomes without compromising graft integrity.' }],
    confidence: 0.92,
    suggestedQuestions: ['What are the success rates of different ACL graft types?', 'How long is the recovery period after ACL reconstruction?', 'What are the common complications of ACL surgery?'],
  },
  {
    keywords: ['rotator cuff', 'shoulder'],
    answer: 'Rotator cuff pathology is diagnosed through a combination of clinical examination (Jobe, drop-arm, and external rotation lag tests) and imaging, with MRI as the gold standard for tear characterization. Management is stratified by tear size and chronicity: partial-thickness tears and degenerative full-thickness tears in low-demand patients respond well to structured physiotherapy, while acute full-thickness tears in active patients generally warrant arthroscopic repair within six weeks to limit retraction and fatty infiltration.',
    sources: [{ id: 1, title: 'Operative Versus Conservative Management of Rotator Cuff Tears', authors: 'Nakamura, H., Osei, D., & Lindqvist, E.', journal: 'The Bone & Joint Journal', year: 2023, volume: '105-B', issue: '7', pages: '714-723', url: '#', relevance: 0.93, excerpt: 'At five-year follow-up, early arthroscopic repair of acute full-thickness tears showed superior Constant scores versus delayed repair, while degenerative tears showed no significant surgical advantage over supervised exercise.' }, { id: 2, title: 'Imaging Pathways for Shoulder Pain in Primary Care', authors: 'Alvarez, M., & Kowalski, P.', journal: 'Skeletal Radiology', year: 2022, volume: '51', issue: '4', pages: '801-812', url: '#', relevance: 0.84, excerpt: 'Ultrasound demonstrated 91% sensitivity for full-thickness tears when performed by experienced operators, supporting its role as a first-line modality before MRI.' }],
    confidence: 0.89,
    suggestedQuestions: ['When should a rotator cuff tear be repaired surgically?', 'What does rotator cuff rehabilitation involve?', 'How accurate is ultrasound versus MRI for rotator cuff tears?'],
  },
  {
    keywords: ['fracture', 'radius', 'wrist', 'broken'],
    answer: 'Distal radius fractures are managed according to stability, displacement, and patient demand. Stable, minimally displaced fractures do well with closed reduction and cast immobilization for 5–6 weeks with radiographic surveillance at 1 and 2 weeks. Unstable patterns — dorsal comminution, intra-articular step-off >2 mm, or loss of reduction — favor volar locking plate fixation, which permits early mobilization. In elderly low-demand patients, recent trials show comparable patient-reported outcomes between operative and non-operative care despite radiographic differences.',
    sources: [{ id: 1, title: 'Volar Locking Plate Versus Cast Immobilization for Displaced Distal Radius Fractures', authors: 'Okafor, C., Bergström, L., & Tanaka, Y.', journal: 'Journal of Hand Surgery', year: 2024, volume: '49', issue: '3', pages: '221-233', url: '#', relevance: 0.94, excerpt: 'Among patients over 65, DASH scores at 12 months did not differ significantly between operative and non-operative groups, although grip strength recovered faster after plating.' }, { id: 2, title: 'Radiographic Predictors of Instability in Distal Radius Fractures', authors: 'Meyer, S., & Dubois, A.', journal: 'Injury', year: 2022, volume: '53', issue: '10', pages: '3302-3310', url: '#', relevance: 0.86, excerpt: 'Initial dorsal angulation greater than 20 degrees and metaphyseal comminution were the strongest predictors of secondary displacement in cast-treated fractures.' }],
    confidence: 0.90,
    suggestedQuestions: ['What are the signs a wrist fracture needs surgery?', 'How long does a distal radius fracture take to heal?', 'What complications follow volar plate fixation?'],
  },
];

const GENERIC_RESPONSE = (query) => ({
  answer: `Here is a synthesis of the current orthopedic literature relevant to "${query}". The evidence base emphasizes accurate clinical assessment, imaging appropriate to the suspected structure, and stratifying treatment by patient activity level and comorbidity. Conservative management with structured physiotherapy is the first line for most soft-tissue presentations, with surgical referral indicated for mechanical symptoms, progressive neurology, or failure of 3–6 months of supervised non-operative care. (Note: this is a demo response — connect the RAG backend for live literature retrieval.)`,
  sources: [{ id: 1, title: 'Evidence-Based Pathways in Musculoskeletal Care: A Systematic Overview', authors: 'Ferreira, G., Hall, M., & Ostrowski, J.', journal: 'BMJ Open Sport & Exercise Medicine', year: 2023, volume: '9', issue: '1', pages: 'e001542', url: '#', relevance: 0.78, excerpt: 'Across 112 guidelines, exercise therapy and staged escalation of care were consistently recommended ahead of surgical intervention for non-traumatic musculoskeletal disorders.' }],
  confidence: 0.71,
  suggestedQuestions: ['What is the most effective treatment for ACL tears?', 'How are rotator cuff injuries diagnosed and managed?', 'What do current guidelines say about distal radius fractures?'],
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request) {
  let body;
  try { body = await request.json(); }
  catch { return Response.json({ error: 'Invalid JSON body' }, { status: 400 }); }

  const query = (body?.query || '').trim();
  if (!query) return Response.json({ error: 'Missing "query" field' }, { status: 400 });

  await delay(800);
  const lower = query.toLowerCase();
  const match = KNOWLEDGE_BASE.find((entry) => entry.keywords.some((k) => lower.includes(k)));
  const { keywords, ...payload } = match || {};
  return Response.json(match ? payload : GENERIC_RESPONSE(query));
}
