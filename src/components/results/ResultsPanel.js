// src/components/results/ResultsPanel.js
import SourceCitation from './SourceCitation';

export default function ResultsPanel({ results, isLoading }) {
  if (isLoading) {
    return (
      <div className="results-panel loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p>Analyzing orthopedic research...</p>
      </div>
    );
  }

  return (
    <div className="results-panel">
      <div className="results-header">
        <h3>Research Findings</h3>
        <div className="confidence-badge">
          <span>Confidence: {(results.confidence * 100).toFixed(0)}%</span>
        </div>
      </div>
      
      <div className="answer-section">
        <div className="answer-content">
          <p>{results.answer}</p>
        </div>
      </div>
      
      <div className="sources-section">
        <h4>Supporting Research</h4>
        <div className="sources-list">
          {results.sources.map(source => (
            <SourceCitation key={source.id} source={source} />
          ))}
        </div>
      </div>
    </div>
  );
}