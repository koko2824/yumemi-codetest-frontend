'use client';

interface GraphTitleProps {
  title: string;
}

export default function GraphTitle({ title }: GraphTitleProps) {
  return <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>;
}
