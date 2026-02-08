import { useState } from 'react';
import { useUploadPhoto } from '../hooks/useQueries';
import { ExternalBlob } from '../backend';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePhotoUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const uploadPhoto = useUploadPhoto();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe ser menor a 5MB');
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setProgress(percentage);
      });

      await uploadPhoto.mutateAsync(blob);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="photo-upload"
        disabled={uploading}
      />
      <label htmlFor="photo-upload">
        <Button
          type="button"
          size="icon"
          className="rounded-full bg-white/90 hover:bg-white text-emerald-600 shadow-lg"
          disabled={uploading}
          asChild
        >
          <span>
            <Camera className="h-5 w-5" />
          </span>
        </Button>
      </label>
      {uploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
          <div className="text-white text-center">
            <div className="text-2xl font-bold">{progress}%</div>
            <div className="text-sm">Subiendo...</div>
          </div>
        </div>
      )}
    </div>
  );
}
