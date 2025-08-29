import React, { useState, useEffect, useCallback } from 'react';
import { Question, QuizSettings, QuizMode, UserAnswer } from '../types';

interface QuizScreenProps {
  questions: Question[];
  settings: QuizSettings;
  mode: QuizMode;
  onQuizComplete: (answers: UserAnswer[]) => void;
}

const Timer: React.FC<{ initialTime: number; onTimeUp: () => void }> = ({ initialTime, onTimeUp }) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }
        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [timeLeft, onTimeUp]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className={`font-mono text-lg font-bold px-3 py-1 rounded-md ${timeLeft < 60 ? 'text-red-600 bg-red-100' : 'text-slate-700 bg-slate-100'}`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
    );
};

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, settings, mode, onQuizComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>(() => questions.map(q => ({ questionId: q.id, selectedOptionIndex: null, isCorrect: null })));
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);

  const handleTimeUp = useCallback(() => {
    onQuizComplete(answers);
  }, [answers, onQuizComplete]);

  const handleAnswerSelect = (optionIndex: number) => {
    // In Study mode, prevent changing answer after it has been "checked"
    if (mode === QuizMode.Study && showFeedback) return;

    const isCorrect = optionIndex === currentQuestion.correctAnswerIndex;
    setAnswers(prev =>
      prev.map(a =>
        a.questionId === currentQuestion.id
          ? { ...a, selectedOptionIndex: optionIndex, isCorrect }
          : a
      )
    );
  };

  const handleCheckAnswer = () => {
    if (currentAnswer?.selectedOptionIndex !== null) {
        setShowFeedback(true);
    }
  };

  const goToNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowFeedback(false);
    }
  };
  
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowFeedback(false); // Feedback is only for the current question
    }
  };

  const handleSubmit = () => {
    onQuizComplete(answers);
  };
  
  const getOptionClasses = (optionIndex: number) => {
    const base = "w-full text-left p-4 my-2 border rounded-lg transition-all duration-200 cursor-pointer flex items-center";
    const selected = currentAnswer?.selectedOptionIndex === optionIndex;

    if (mode === QuizMode.Study && showFeedback) {
        const isCorrect = optionIndex === currentQuestion.correctAnswerIndex;
        if (isCorrect) return `${base} bg-green-100 border-green-500 text-green-800 ring-2 ring-green-500`;
        if (selected && !isCorrect) return `${base} bg-red-100 border-red-500 text-red-800`;
        return `${base} bg-white border-slate-300 text-slate-700`;
    }

    // Exam mode or Study mode before checking
    if (selected) return `${base} bg-sky-100 border-sky-500 ring-2 ring-sky-500 text-sky-800`;
    return `${base} bg-white border-slate-300 hover:bg-slate-50 hover:border-sky-400`;
  };

  const isLastQuestion = currentIndex === questions.length - 1;

  const renderRightButton = () => {
      if (mode === QuizMode.Study) {
          if (showFeedback) {
              if (isLastQuestion) {
                  return (
                      <button onClick={handleSubmit} className="px-8 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700">
                          Nộp bài
                      </button>
                  );
              }
              return (
                  <button onClick={goToNext} className="px-8 py-2 text-sm font-medium text-white bg-sky-600 border border-transparent rounded-md shadow-sm hover:bg-sky-700">
                      Câu tiếp
                  </button>
              );
          }
          return (
              <button
                  onClick={handleCheckAnswer}
                  disabled={currentAnswer?.selectedOptionIndex === null}
                  className="px-8 py-2 text-sm font-medium text-white bg-sky-600 border border-transparent rounded-md shadow-sm hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                  Kiểm tra
              </button>
          );
      }

      // Exam Mode
      if (isLastQuestion) {
          return (
              <button onClick={handleSubmit} className="px-8 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700">
                  Nộp bài
              </button>
          );
      }
      return (
          <button onClick={goToNext} className="px-8 py-2 text-sm font-medium text-white bg-sky-600 border border-transparent rounded-md shadow-sm hover:bg-sky-700">
              Câu tiếp
          </button>
      );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
            <h2 className="text-xl font-bold text-sky-700">
                {mode === QuizMode.Study ? 'Chế độ Học tập' : 'Chế độ Thi'}
            </h2>
            <p className="text-sm text-slate-500">Câu hỏi {currentIndex + 1} / {questions.length}</p>
        </div>
        <Timer initialTime={settings.timeLimit} onTimeUp={handleTimeUp} />
      </div>

      <div>
        <p className="text-lg font-semibold text-slate-800 mb-6 leading-relaxed">
          {`Câu ${currentIndex + 1}: ${currentQuestion.question}`}
        </p>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button key={index} onClick={() => handleAnswerSelect(index)} className={getOptionClasses(index)} disabled={mode === QuizMode.Study && showFeedback}>
              <span className="flex-shrink-0 h-6 w-6 rounded-full border-2 border-slate-400 flex items-center justify-center mr-4 font-bold text-sm">
                {String.fromCharCode(65 + index)}
              </span>
              <span>{option}</span>
            </button>
          ))}
        </div>
      </div>
      
      {mode === QuizMode.Study && showFeedback && (
        <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-700">Giải thích:</h4>
            <p className="text-sm text-slate-600 mt-1">Trích dẫn nguồn: {currentQuestion.source}</p>
        </div>
      )}

      <div className="mt-8 pt-4 border-t flex justify-between items-center">
        {mode === QuizMode.Exam && (
            <button
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className="px-6 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Câu trước
            </button>
        )}
         {mode === QuizMode.Study && <div />} {/* Placeholder to keep the right button on the right */}

        {renderRightButton()}
      </div>
    </div>
  );
};

export default QuizScreen;