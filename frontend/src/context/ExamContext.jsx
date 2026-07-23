import React, { createContext, useContext, useState, useEffect } from 'react';
import { examService } from '../services/api';

const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
  const [activeExam, setActiveExam] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: { selectedAnswer, isMarkedForReview } }
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    if (!activeExam || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          autoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeExam, secondsRemaining]);

  // Anti-cheat refresh warning listener
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (activeExam) {
        e.preventDefault();
        e.returnValue = 'Warning: Leaving or refreshing the page will auto-submit your test!';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [activeExam]);

  const startExam = async (testId) => {
    const res = await examService.startExam(testId);
    const examData = res.data;
    setActiveExam(examData);
    setCurrentIndex(0);
    setAnswers({});
    setSecondsRemaining(examData.durationMinutes * 60);
    return examData;
  };

  const selectAnswer = (questionId, optionLabel) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selectedAnswer: optionLabel,
      },
    }));
  };

  const toggleMarkForReview = (questionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        isMarkedForReview: !prev[questionId]?.isMarkedForReview,
      },
    }));
  };

  const submitExam = async () => {
    if (!activeExam || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formattedAnswers = Object.entries(answers).map(([qId, val]) => ({
        questionId: parseInt(qId),
        selectedAnswer: val.selectedAnswer || null,
        isMarkedForReview: val.isMarkedForReview || false,
      }));

      const totalDurationSec = activeExam.durationMinutes * 60;
      const timeTakenSec = Math.max(1, totalDurationSec - secondsRemaining);

      const payload = {
        attemptId: activeExam.attemptId,
        timeTakenSeconds: timeTakenSec,
        answers: formattedAnswers,
      };

      const res = await examService.submitExam(payload);
      setActiveExam(null);
      return res.data;
    } finally {
      setIsSubmitting(false);
    }
  };

  const autoSubmit = () => {
    submitExam();
  };

  return (
    <ExamContext.Provider
      value={{
        activeExam,
        currentIndex,
        setCurrentIndex,
        answers,
        secondsRemaining,
        isSubmitting,
        startExam,
        selectAnswer,
        toggleMarkForReview,
        submitExam,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => useContext(ExamContext);
