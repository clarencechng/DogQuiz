// DogApiService.ts

export type DogBreed = {
    breed: string;
    subBreeds: string[];
};

export type DogImage = {
    url: string;
};

export async function fetchDogBreeds(): Promise<DogBreed[]> {
    try {
        const response = await fetch('https://dog.ceo/api/breeds/list/all');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (data.status !== 'success' || typeof data.message !== 'object') {
            throw new Error('Invalid API response');
        }
        // Map the breed/sub-breed structure to DogBreed[]
        const breeds: DogBreed[] = [];
        for (const breed in data.message) {
            const subBreeds: string[] = data.message[breed];
            breeds.push({ breed, subBreeds });
        }
        return breeds;
    } catch (error) {
        console.error('Failed to fetch dog breeds:', error);
        return [];
    }
}

export async function fetchDogImageURL(breed: string, subType?: string): Promise<DogImage> {
    try {
        let urlString: string;

        if (subType) {
            urlString = `https://dog.ceo/api/breed/${breed}/${subType}/images/random`;
        } else {
            urlString = `https://dog.ceo/api/breed/${breed}/images/random`;
        }

        const response = await fetch(urlString);

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (data.status !== 'success' || typeof data.message !== 'string') {
            throw new Error('Invalid API response');
        }
        return { url: data.message };
    } catch (error) {
        console.error('Failed to fetch dog image:', error);
    }
    return { url: '' };
}