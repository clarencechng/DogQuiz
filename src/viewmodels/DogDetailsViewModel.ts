import { useEffect, useState } from 'react';
import { DogRepository } from '../repositories/DogRepository';

export function useDogDetailsViewModel(breed?: string, subBreed?: string) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!breed) return;
    const fetchImage = async () => {
      setLoading(true);
      const repo = new DogRepository();
      const image = await repo.fetchDogImageURL(breed, subBreed || undefined);
      setImageUrl(image.url);
      setLoading(false);
    };
    fetchImage();
  }, [breed, subBreed]);

  return { imageUrl, loading };
} 