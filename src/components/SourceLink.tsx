interface SourceLinkProps {
  page: number;
}

/** Opens the original plan at a page in the browser's own PDF viewer. */
export function SourceLink({ page }: SourceLinkProps) {
  return (
    <a className="source-link" href={`${import.meta.env.BASE_URL}documents/outdoor-kitchen-plan.pdf#page=${page}`} target="_blank" rel="noreferrer">
      עמוד {page} בתכנית
    </a>
  );
}
