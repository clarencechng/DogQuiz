// DogQuizViewModel.ts

import { useEffect, useState } from 'react';
import { DogBreed } from '../DogApiService';
import { DogRepository } from '../repositories/DogRepository';

export type Question = {
  imageURL: string;
  options: string[];
  correctAnswerIndex: number;
};

export type DogQuizViewModel = {
  breedsLoading: boolean;
  questions: Question[];
  regenerateQuestions: () => Promise<void>;
};

export function useDogQuizViewModel(): DogQuizViewModel {
  const dogRepository = new DogRepository();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [breeds, setBreeds] = useState<DogBreed[]>([]);
  const [breedsLoading, setBreedsLoading] = useState<boolean>(true);
  const [questions, setQuestions] = useState<Question[]>([]);

  const regenerateQuestions = async () => {
    setBreedsLoading(true);
    let breedsList = breeds;
    // If breeds not loaded yet, fetch them
    if (!breedsList.length) {
      breedsList = await dogRepository.fetchBreeds();
      setBreeds(breedsList);
    }
    // Pick 10 random dogs
    const chosenDogs = breedsList
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);

    // Helper to get formatted name
    const getFormattedName = (dog: DogBreed, subBreed?: string) =>
      subBreed ? `${dog.breed} ${subBreed}` : dog.breed;

    // All formatted breed names
    const allBreedsFormatted = breedsList.flatMap(dog =>
      dog.subBreeds.length > 0
        ? dog.subBreeds.map(sub => getFormattedName(dog, sub))
        : [dog.breed]
    );

    // For each chosen dog, pick a random subBreed if available
    const chosenDogsWithSub = chosenDogs.map(dog => {
      if (dog.subBreeds.length > 0) {
        const subBreed = dog.subBreeds[Math.floor(Math.random() * dog.subBreeds.length)];
        return { ...dog, chosenSubBreed: subBreed };
      }
      return { ...dog, chosenSubBreed: undefined };
    });

    // Fetch images for each chosen dog
    const images = await Promise.all(
      chosenDogsWithSub.map(dog => dogRepository.fetchDogImageURL(dog.breed, dog.chosenSubBreed))
    );

    // Build questions
    const questions: Question[] = chosenDogsWithSub.map((dog, idx) => {
      const correct = getFormattedName(dog, dog.chosenSubBreed);
      // Get 3 random incorrect options
      const incorrectOptions = allBreedsFormatted
        .filter(name => name !== correct)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      // Shuffle correct + incorrect options
      const options = [correct, ...incorrectOptions].sort(() => Math.random() - 0.5);
      const correctAnswerIndex = options.indexOf(correct);
      return {
        imageURL: images[idx].url,
        options,
        correctAnswerIndex,
      };
    });
    setQuestions(questions);
    setBreedsLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    setBreedsLoading(true);
    dogRepository.fetchBreeds().then(async breedsList => {
      if (mounted) {
        setBreeds(breedsList);
        await regenerateQuestions();
      }
    });
    return () => { mounted = false; };
  }, []);

  return {
    breedsLoading,
    questions,
    regenerateQuestions,
  };
} 