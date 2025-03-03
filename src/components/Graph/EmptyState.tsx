'use client';

interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex justify-center items-center h-64 bg-gray-50 border border-gray-200 rounded-lg">
      <p className="text-gray-500">{message}</p>
    </div>
  );
}
