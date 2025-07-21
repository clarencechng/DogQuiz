import { DogBreed, DogImage } from '../DogApiService';

export interface IDogRepository {
  fetchBreeds(): Promise<DogBreed[]>;
  fetchDogImageURL(breed: string, subType?: string): Promise<DogImage>;
}

export class DogRepository implements IDogRepository {
  async fetchBreeds(): Promise<DogBreed[]> {
    const { fetchDogBreeds } = await import('../DogApiService');
    return fetchDogBreeds();
  }

  async fetchDogImageURL(breed: string, subType?: string): Promise<DogImage> {
    const { fetchDogImageURL } = await import('../DogApiService');
    return fetchDogImageURL(breed, subType);
  }
} 