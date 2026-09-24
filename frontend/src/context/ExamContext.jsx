import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { examService } from '../services/api';

const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
  const [activeExam, setActiveExam] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Refs to avoid stale closures in timer
  const answersRef = useRef(answers);
  const activeExamRef = useRef(activeExam);
  const secondsRef = useRef(secondsRemaining);
  const isSubmittingRef = useRef(isSubmitting);
  const navigate = useNavigate();

  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { activeExamRef.current = activeExam; }, [activeExam]);
  useEffect(() => { secondsRef.current = secondsRemaining; }, [secondsRemaining]);
  useEffect(() => { isSubmittingRef.current = isSubmitting; }, [isSubmitting]);

  // Countdown timer — runs once when exam starts
  useEffect(() => {
    if (!activeExam) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit using refs to avoid stale closure
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeExam?.attemptId]); // only restart when a new exam begins

  // Anti-cheat refresh warning listener
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (activeExamRef.current) {
        e.preventDefault();
        e.returnValue = 'Warning: Leaving or refreshing the page will auto-submit your test!';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleAutoSubmit = async () => {
    const exam = activeExamRef.current;
    if (!exam || isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answersRef.current).map(([qId, val]) => ({
        questionId: parseInt(qId),
        selectedAnswer: val.selectedAnswer || null,
        isMarkedForReview: val.isMarkedForReview || false,
      }));
      const totalDurationSec = exam.durationMinutes * 60;
      const payload = {
        attemptId: exam.attemptId,
        timeTakenSeconds: totalDurationSec,
        answers: formattedAnswers,
      };
      const res = await examService.submitExam(payload);
      setActiveExam(null);
      navigate(`/student/result/${res.data.attemptId}`);
    } catch (err) {
      console.error('Auto-submit failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const autoSubmit = () => handleAutoSubmit();

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
