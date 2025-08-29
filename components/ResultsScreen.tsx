import React, { useMemo, useState } from 'react';
import { Question, UserAnswer } from '../types';

interface ResultsScreenProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ questions, userAnswers, onRestart }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { correctCount, totalCount, score } = useMemo(() => {
    const correctCount = userAnswers.filter(a => a.isCorrect).length;
    const totalCount = questions.length;
    const score = totalCount > 0 ? ((correctCount / totalCount) * 100).toFixed(2) : 0;
    return { correctCount, totalCount, score };
  }, [userAnswers, questions]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold text-slate-800">Kết quả bài thi</h2>
      <p className="text-slate-500 mt-2">Chúc mừng bạn đã hoàn thành!</p>

      <div className="my-8 w-full max-w-sm bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
        <p className="text-lg text-slate-600">Điểm số của bạn</p>
        <p className="text-6xl font-bold text-sky-600 my-2">{score}%</p>
        <p className="text-lg font-medium text-slate-700">
          {correctCount} / {totalCount} câu trả lời đúng
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onRestart}
          className="px-8 py-3 text-sm font-medium text-white bg-sky-600 border border-transparent rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          Chọn bài khác
        </button>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-8 py-3 text-sm font-medium text-sky-700 bg-sky-100 border border-transparent rounded-md hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          {showDetails ? 'Ẩn chi tiết' : 'Xem chi tiết'}
        </button>
      </div>
      
      {showDetails && (
        <div className="mt-10 w-full border-t pt-6">
            <h3 className="text-xl font-semibold text-slate-700 mb-4">Xem lại bài làm</h3>
            <div className="space-y-6">
                {questions.map((q, index) => {
                    const userAnswer = userAnswers.find(a => a.questionId === q.id);
                    const selectedOption = userAnswer?.selectedOptionIndex;
                    const correctOption = q.correctAnswerIndex;
                    
                    return (
                        <div key={q.id} className="p-4 bg-white rounded-lg border border-slate-200">
                            <p className="font-semibold text-slate-800">{`Câu ${index + 1}: ${q.question}`}</p>
                            <div className="mt-3 space-y-2 text-sm">
                                {q.options.map((option, optIndex) => {
                                    let optionClass = "flex p-2 rounded";
                                    if(optIndex === correctOption) {
                                        optionClass += " bg-green-100 text-green-900 font-medium";
                                    } else if (optIndex === selectedOption && selectedOption !== correctOption) {
                                        optionClass += " bg-red-100 text-red-900";
                                    }

                                    return (
                                        <div key={optIndex} className={optionClass}>
                                            <span>{String.fromCharCode(65 + optIndex)}. {option}</span>
                                            {optIndex === selectedOption && selectedOption !== correctOption && <span className="ml-2 font-bold">(Bạn chọn)</span>}
                                            {optIndex === correctOption && <span className="ml-2 font-bold">(Đáp án đúng)</span>}
                                        </div>
                                    )
                                })}
                            </div>
                             <p className="text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">Nguồn: {q.source}</p>
                        </div>
                    );
                })}
            </div>
        </div>
      )}
    </div>
  );
};

export default ResultsScreen;