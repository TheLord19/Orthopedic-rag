// src/components/results/SourceCitation.js
export default function SourceCitation({ source }) {
  return (
    <div className="source-citation">
      <div className="source-header">
        <h5>{source.title}</h5>
        <div className="relevance-badge">
          <span>{(source.relevance * 100).toFixed(0)}% relevant</span>
        </div>
      </div>
      <div className="source-meta">
        <span className="authors">{source.authors}</span>
        <span className="journal">{source.journal}, {source.year}</span>
      </div>
      <p className="source-excerpt">{source.excerpt}</p>
    </div>
  );
}