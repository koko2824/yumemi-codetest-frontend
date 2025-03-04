'use client';

import { ChangeEvent } from 'react';

interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function Checkbox({ id, label, checked, onChange }: CheckboxProps) {
  return (
    <div className="flex items-center mb-2">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 bg-gray border-gray-300 rounded focus:ring-blue-500"
      />
      <label htmlFor={id} className="ml-2 text-sm font-medium text-gray-900">
        {label}
      </label>
    </div>
  );
}
