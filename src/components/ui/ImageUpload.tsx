import React, { useState, useRef } from 'react';
import { Cloud, Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
  accept?: string;
  className?: string;
  disabled?: boolean;
  helperText?: string;
  multiple?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value = '',
  onChange,
  label = 'Upload Image',
  description,
  accept = 'image/jpeg,image/png,image/webp,image/gif',
  className = '',
  disabled = false,
  helperText,
  multiple = false,
}) => {
  const effectiveHelperText = helperText || description || 'PNG, JPG, WEBP or GIF up to 5MB';
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelected(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelected(files[0]);
    }
    // reset input so the same file could be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelected = async (file: File) => {
    setErrorMessage(null);

    // Validate mime type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file.');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size exceeds 5MB limit.');
      return;
    }

    setIsUploading(true);
    setProgress(15);

    // Mock upload if Supabase is not configured
    if (!isSupabaseConfigured || !supabase) {
      try {
        // Simulate upload progress
        await new Promise((res) => setTimeout(res, 250));
        setProgress(45);
        await new Promise((res) => setTimeout(res, 250));
        setProgress(85);

        // Convert to data URL so the uploaded preview persists in local test session
        const reader = new FileReader();
        reader.onloadend = () => {
          const resultUrl = reader.result as string;
          setProgress(100);
          setTimeout(() => {
            onChange(resultUrl);
            setIsUploading(false);
            setProgress(0);
          }, 200);
        };
        reader.onerror = () => {
          setErrorMessage('Failed to read selected image.');
          setIsUploading(false);
          setProgress(0);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error('Mock upload error:', err);
        setErrorMessage('Failed to upload image.');
        setIsUploading(false);
        setProgress(0);
      }
      return;
    }

    // Supabase Upload
    try {
      setProgress(30);
      const fileExt = file.name.split('.').pop() || 'jpg';
      const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `uploads/${cleanFileName}`;

      let activeBucket = 'images';
      let uploadResult = await supabase.storage
        .from(activeBucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadResult.error && uploadResult.error.message?.toLowerCase().includes('not found')) {
        activeBucket = 'media';
        uploadResult = await supabase.storage
          .from(activeBucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });
      }

      if (uploadResult.error) {
        throw uploadResult.error;
      }

      setProgress(85);

      const { data: publicUrlData } = supabase.storage
        .from(activeBucket)
        .getPublicUrl(uploadResult.data.path);

      setProgress(100);
      setTimeout(() => {
        onChange(publicUrlData.publicUrl);
        setIsUploading(false);
        setProgress(0);
      }, 200);
    } catch (err: unknown) {
      console.warn('Supabase storage upload error:', err);
      const errObj = err as { message?: string };
      const msg = errObj?.message || 'Upload to Supabase Storage failed.';
      setErrorMessage(`Storage error: ${msg}`);
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setErrorMessage(null);
  };

  const triggerSelect = () => {
    if (!disabled && !isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="admin-label">{label}</label>}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {value ? (
        /* Image Preview Box */
        <div className="relative group rounded-lg border border-charcoal-200 overflow-hidden bg-charcoal-50 max-w-md">
          <div className="relative aspect-video w-full overflow-hidden bg-charcoal-100 flex items-center justify-center">
            <img
              src={value}
              alt="Uploaded preview"
              className="h-full w-full object-cover"
            />
            
            {/* Hover overlay with action buttons */}
            <div className="absolute inset-0 bg-charcoal-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={triggerSelect}
                disabled={disabled || isUploading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-saffron-500 hover:bg-saffron-600 rounded-md shadow-sm transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                Change
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled || isUploading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm transition-colors"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          </div>

          {/* Quick remove badge at top-right for mobile / touch */}
          <button
            type="button"
            onClick={handleRemove}
            className="sm:hidden absolute top-2 right-2 rounded-full bg-charcoal-900/80 p-1.5 text-white hover:bg-charcoal-900 transition-colors"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        /* Dropzone Upload Box */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerSelect}
          className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors cursor-pointer ${
            isDragging
              ? 'border-saffron-500 bg-saffron-50/70'
              : 'border-charcoal-300 bg-white hover:border-saffron-500 hover:bg-warm-50/50'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {isUploading ? (
            /* Uploading state */
            <div className="w-full max-w-xs space-y-3 py-2">
              <Loader2 className="h-8 w-8 animate-spin text-saffron-600 mx-auto" />
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-charcoal-600 font-medium">
                  <span>Uploading image...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-charcoal-200">
                  <div
                    className="h-full bg-saffron-500 transition-all duration-200 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Idle dropzone */
            <>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-saffron-50 text-saffron-600">
                {isDragging ? (
                  <Cloud className="h-6 w-6 stroke-[1.8] animate-bounce" />
                ) : (
                  <Upload className="h-6 w-6 stroke-[1.8]" />
                )}
              </div>

              <div className="space-y-1 text-sm">
                <p className="font-medium text-charcoal-800">
                  <span className="text-saffron-600 font-semibold hover:underline">
                    Click to browse
                  </span>{' '}
                  or drag and drop
                </p>
                <p className="text-xs text-charcoal-500">{effectiveHelperText}</p>
              </div>

              {!isSupabaseConfigured && (
                <span className="mt-3 inline-flex items-center gap-1 rounded bg-saffron-50 px-2 py-0.5 text-[10px] font-semibold text-saffron-800 border border-saffron-200">
                  <ImageIcon className="h-3 w-3" />
                  Dev Mode: Simulated upload
                </span>
              )}
            </>
          )}
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <p className="text-xs text-red-600 font-medium mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default ImageUpload;
