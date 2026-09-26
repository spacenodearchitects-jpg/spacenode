'use client';

import { useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

function compressImage(file: File, maxWidth = 1600, maxHeight = 1600, quality = 0.82): Promise<Blob> {
  return new Promise((resolve) => {
    // If SVG or tiny image, skip compression
    if (file.type === 'image/svg+xml' || file.size < 200 * 1024) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

export default function ImageUploadInput({
  label,
  value,
  onChange,
  placeholder = '/images/filename.jpg or https://...',
}: ImageUploadInputProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const originalFile = files[0];
      const compressedBlob = await compressImage(originalFile);
      const fileName = originalFile.name.replace(/\.[^/.]+$/, '') + '.jpg';

      const formData = new FormData();
      formData.append('file', compressedBlob, fileName);

      const res = await fetch('/api/cms/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        onChange(data.url);
      } else {
        alert(data.message || 'Failed to upload image');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block font-sans text-xs uppercase tracking-wider text-gray-700 font-medium">
        {label}
      </label>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Preview Thumbnail */}
        <div className="relative w-14 h-14 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0 flex items-center justify-center">
          {value ? (
            <Image src={value} alt="Preview" fill className="object-cover" unoptimized={value.startsWith('data:')} />
          ) : (
            <ImageIcon size={20} className="text-gray-400" />
          )}
        </div>

        {/* Input Text Field */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-xs font-mono text-gray-800 focus:border-[#0D7A9E] focus:outline-none pr-8"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              title="Clear URL"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* File Upload Button */}
        <label className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-[#0D7A9E] hover:text-white border border-gray-200 hover:border-[#0D7A9E] rounded-xl text-xs font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer flex-shrink-0 shadow-sm">
          <Upload size={14} />
          <span>{uploading ? 'Compressing & Uploading...' : 'Upload File'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
