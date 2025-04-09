'use client';

import React, { useRef } from 'react';
import { Button } from './button';

interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onFileSelect?: (file: File) => void;
}

export function FileInput({ className, onFileSelect, ...props }: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <div className={className}>
      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
      >
        Select File
      </Button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        {...props}
      />
    </div>
  );
} 