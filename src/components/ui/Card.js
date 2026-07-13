// src/components/ui/Card.js
export default function Card({ title, footer, children, className = "" }) {
  return (
    <div className={`ui-card ${className}`.trim()}>
      {title && <div className="ui-card-header">{title}</div>}
      <div className="ui-card-body">{children}</div>
      {footer && <div className="ui-card-footer">{footer}</div>}
    </div>
  );
}
