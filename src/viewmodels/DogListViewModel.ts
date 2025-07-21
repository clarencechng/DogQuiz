import { useEffect, useState } from 'react';
import { DogRepository } from '../repositories/DogRepository';

export type DogListItem = { breed: string; subBreed?: string };

export type DogListViewModel = {
  dogList: DogListItem[];
  loading: boolean;
}

export function useDogListViewModel(): DogListViewModel {
  const [dogList, setDogList] = useState<DogListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBreeds = async () => {
      const repo = new DogRepository();
      const breeds = await repo.fetchBreeds();
      const list: DogListItem[] = [];
      breeds.forEach(breedObj => {
        if (breedObj.subBreeds.length > 0) {
          breedObj.subBreeds.forEach(sub => list.push({ breed: breedObj.breed, subBreed: sub }));
        } else {
          list.push({ breed: breedObj.breed });
        }
      });
      setDogList(list);
      setLoading(false);
    };
    fetchBreeds();
  }, []);

  return { dogList, loading };
} 