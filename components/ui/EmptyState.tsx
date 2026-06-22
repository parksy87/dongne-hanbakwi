"use client";

interface EmptyStateProps {
  emoji?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  emoji = "📭",
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <div className="text-5xl mb-4">{emoji}</div>
      <p className="text-lg font-bold text-secondary mb-2">{title}</p>
      {description && (
        <p className="text-gray-500 text-base leading-relaxed mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}
