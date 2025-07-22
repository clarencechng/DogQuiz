import { IconSymbol } from '@/components/ui/IconSymbol';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBottomTabOverflow as useBottomTabBarHeightDefault } from '../../components/ui/TabBarBackground';
import { useBottomTabOverflow as useBottomTabBarHeightIOS } from '../../components/ui/TabBarBackground.ios';
import { Question, useDogQuizViewModel } from '../../src/viewmodels/DogQuizViewModel';

export default function DogQuizScreen() {
    const quizVM = useDogQuizViewModel();
    const [showQuizComplete, setShowQuizComplete] = useState(false);
    const [showCongrats, setShowCongrats] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
    const [score, setScore] = useState(0);

    const bottomTabBarHeight = Platform.OS === 'ios' ? useBottomTabBarHeightIOS() : useBottomTabBarHeightDefault();
    const nextButtonHeight = 22 * 2; 
    const nextButtonMargin = 24; 
    const nextButtonSpacing = 24;
    const scrollContentPaddingBottom = bottomTabBarHeight + nextButtonHeight + nextButtonMargin + nextButtonSpacing;

    const questions = quizVM.questions;
    const currentQuestion: Question | undefined = questions[currentQuestionIndex];

    const getButtonStyle = (idx: number) => {
        if (selectedOptionIndex === null) return styles.answerButton;
        if (selectedOptionIndex === idx) {
            return [
                styles.answerButton,
                idx === currentQuestion?.correctAnswerIndex ? styles.answerCorrect : styles.answerWrong,
            ];
        }

        if (idx === currentQuestion?.correctAnswerIndex) {
            return [styles.answerButton, styles.answerCorrect, { opacity: 0.7 }];
        }
        return styles.answerButton;
    };

    const getIcon = (idx: number) => {
        if (selectedOptionIndex === null) return null;
        if (selectedOptionIndex === idx) {
            return idx === currentQuestion?.correctAnswerIndex ? <Text style={styles.answerIcon}>✓</Text> : <Text style={styles.answerIcon}>✗</Text>;
        }
        if (idx === currentQuestion?.correctAnswerIndex) {
            return <Text style={styles.answerIcon}>✓</Text>;
        }
        return null;
    };

    // Handle next question
    const handleNext = () => {
        if (currentQuestionIndex < (questions.length - 1)) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOptionIndex(null);
        } else {
            setShowQuizComplete(true);
        }
    };

    // Handle reset quiz
    const resetQuiz = async () => {
        await quizVM.regenerateQuestions();
        setCurrentQuestionIndex(0);
        setSelectedOptionIndex(null);
        setShowQuizComplete(false);
        setScore(0);
    }

    // Loading state
    if (quizVM.breedsLoading || !currentQuestion) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Loading quiz...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <>
        <Stack.Screen options={{ title: 'Guess the Breed!' }} />
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollContentPaddingBottom }]} keyboardShouldPersistTaps="handled">

            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>Guess the Breed!</Text>
              <View style={styles.headerRight}>
                <View style={styles.questionCounter}>
                  <IconSymbol name="list.bullet" size={18} color="#3498ff" />
                  <Text style={styles.questionCounterText}>{currentQuestionIndex + 1}/{questions.length}</Text>
                </View>
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreIcon}>⭐</Text>
                  <Text style={styles.scoreText}>{score}</Text>
                </View>
                <TouchableOpacity
                  style={styles.resetButtonContainer}
                  onPress={() => {
                    Alert.alert(
                      'Reset Quiz',
                      'Are you sure you want to reset your quiz? Your current progress will be lost.',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Reset', style: 'destructive', onPress: resetQuiz },
                      ]
                    );
                  }}
                  hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                   <IconSymbol name="arrow.clockwise" size={22} color="#f87171" />
                </TouchableOpacity>
              </View>
            </View>
            
            <Image source={{ uri: currentQuestion.imageURL }} style={styles.dogImage} resizeMode="contain" />
            
            <Text style={styles.questionTitle}>What breed is this adorable pup?</Text>
            <Text style={styles.questionSubtitle}>Take your best guess!</Text>
            
            <View style={styles.answersBox}>
              {currentQuestion.options.map((option, idx) => (
                <TouchableOpacity
                  key={option}
                  style={getButtonStyle(idx)}
                  disabled={selectedOptionIndex !== null}
                  onPress={() => {
                    setSelectedOptionIndex(idx);
                    if (idx === currentQuestion.correctAnswerIndex) {
                      setScore(prev => prev + 1);
                      setShowCongrats(true);
                      setTimeout(() => setShowCongrats(false), 3000);
                    }
                  }}
                >
                  <Text style={styles.answerText}>{option}</Text>
                  {getIcon(idx)}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
        
        <View style={[styles.nextButtonContainer, { bottom: bottomTabBarHeight + 12 }] } pointerEvents="box-none">
          <TouchableOpacity
            style={[
              styles.nextButtonFullWidth,
              selectedOptionIndex === null && styles.nextButtonDisabled
            ]}
            disabled={selectedOptionIndex === null}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonFullWidthText}>{currentQuestionIndex < (questions.length - 1) ? 'Next Question' : 'Finish Quiz'}</Text>
          </TouchableOpacity>
        </View>
        
        <Modal visible={showQuizComplete} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.quizCompleteModal}>
              <Text style={styles.emoji}>🎉</Text>
              <Text style={styles.quizCompleteTitle}>Quiz Complete!</Text>
              <Text style={styles.quizCompleteSubtitle}>Here's how you did:</Text>
              <View style={styles.scoreBox}>
                <Text style={styles.scoreLabel}>Your Score</Text>
                <Text style={styles.scoreValue}><Text style={styles.scoreNum}>{score}</Text> / {questions.length}</Text>
              </View>
              <TouchableOpacity 
              style={styles.playAgainButton}
              onPress={resetQuiz}
              >
                <IconSymbol name="play.circle" size={22} color="#4f8cff" style={{ marginRight: 6 }} />
                <Text style={styles.playAgainText}>Play Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        <Modal visible={showCongrats} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.congratsModal}>
              <Text style={styles.emoji}>🎉</Text>
              <Text style={styles.congratsTitle}>Congratulations!</Text>
              <Text style={styles.congratsSubtitle}>Correct Answer!</Text>
            </View>
          </View>
        </Modal>
        </>
    );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 'auto',
    paddingRight: 4,
  },
  dogImage: {
    width: '90%',
    aspectRatio: 1,
    alignSelf: 'center',
    borderRadius: 16,
    marginBottom: 16,
    marginTop: 8,
    backgroundColor: '#eee',
  },
  questionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    color: '#222',
  },
  questionSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginBottom: 16,
  },
  answersBox: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  answerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f3f3f3',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  answerText: {
    fontSize: 18,
    color: '#222',
  },
  answerIcon: {
    fontSize: 22,
    marginLeft: 8,
  },
  answerCorrect: {
    backgroundColor: '#4ade80',
    color: '#fff',
  },
  answerWrong: {
    backgroundColor: '#f87171',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizCompleteModal: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  quizCompleteTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  quizCompleteSubtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
  },
  scoreBox: {
    backgroundColor: '#f8f9ff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    width: 160,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#888',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
  },
  scoreNum: {
    color: '#2563eb',
    fontSize: 36,
    fontWeight: 'bold',
  },
  playAgainButton: {
    backgroundColor: 'transparent',
    marginTop: 8,
    flexDirection: 'row',
  },
  playAgainText: {
    fontSize: 18,
    color: '#4f8cff',
    fontWeight: 'bold',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  congratsModal: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  congratsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#22c55e',
  },
  congratsSubtitle: {
    fontSize: 18,
    color: '#888',
    marginBottom: 8,
  },
  nextButtonContainer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 0,
    paddingBottom: 24,
    backgroundColor: 'transparent',
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  nextButtonDisabled: {
    backgroundColor: '#d1c4e9',
    opacity: 0.7,
  },
  scrollContent: {
    // paddingBottom: 120, // This line is removed as per the edit hint
  },
  nextButtonFullWidth: {
    width: '100%',
    backgroundColor: '#a084ee',
    paddingVertical: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16, // Restore rounded corners
    minWidth: undefined,
    paddingHorizontal: 0,
    shadowColor: 'transparent',
  },
  nextButtonFullWidthText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  questionCounter: {
    backgroundColor: '#e0edff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  questionCounterText: {
    color: '#3498ff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 2,
  },
  scoreContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginRight: 0,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  scoreIcon: {
    fontSize: 16,
    color: '#facc15', // gold/yellow
    marginRight: 2,
    marginTop: 1,
  },
  scoreText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#222',
  },
  resetButtonContainer: {
    backgroundColor: '#fde8e8',
    borderRadius: 12,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 0,
  },
}); 