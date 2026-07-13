// src/components/results/SourceCitation.js
export default function SourceCitation({ source, index }) {
  const relevancePct = Math.round(source.relevance * 100);
  const hasRealUrl = source.url && source.url !== "#";

  return (
    <div className="source-citation">
      <div className="source-header">
        <span className="source-num">{index}</span>
        <h5>{source.title}</h5>
      </div>
      <div
        className="relevance-meter"
        title={`${relevancePct}% relevant to your query`}
      >
        <div className="meter-track">
          <div className="meter-fill" style={{ width: `${relevancePct}%` }} />
        </div>
        <span className="relevance-label">{relevancePct}% match</span>
      </div>
      <div className="source-meta">
        <span className="authors">{source.authors}</span>
        <span className="journal">
          {source.journal}, {source.year}
        </span>
      </div>
      <p className="source-excerpt">{source.excerpt}</p>
      {hasRealUrl && (
        <a
          className="source-link"
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          View source
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 17L17 7M17 7H8M17 7V16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      )}
    </div>
  );
}
