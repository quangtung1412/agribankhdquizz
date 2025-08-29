
import React, { useState, useMemo } from 'react';
import { QuizMode, Question, QuizSettings } from '../types';

interface SetupScreenProps {
  mode: QuizMode;
  allQuestions: Question[];
  onStartQuiz: (settings: QuizSettings) => void;
  onBack: () => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ mode, allQuestions, onStartQuiz, onBack }) => {
  const uniqueCategories = useMemo(() => {
    const categories = new Set(allQuestions.map(q => q.category));
    return Array.from(categories);
  }, [allQuestions]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timeLimit, setTimeLimit] = useState<number>(10); // in minutes
  const [showAllCategories, setShowAllCategories] = useState(false);

  const maxQuestions = useMemo(() => {
    if (selectedCategories.length === 0) {
      return allQuestions.length;
    }
    return allQuestions.filter(q => selectedCategories.includes(q.category)).length;
  }, [allQuestions, selectedCategories]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalQuestionCount = Math.min(questionCount, maxQuestions);
    onStartQuiz({
      categories: selectedCategories,
      questionCount: finalQuestionCount > 0 ? finalQuestionCount : 1,
      timeLimit: timeLimit * 60, // convert minutes to seconds
    });
  };

  const displayedCategories = showAllCategories ? uniqueCategories : uniqueCategories.slice(0, 5);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-slate-700 mb-4">
        Cài đặt cho chế độ: <span className="text-sky-600">{mode === QuizMode.Study ? 'Học tập' : 'Thi cử'}</span>
      </h2>
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6">
        {mode === QuizMode.Study && (
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Chọn mảng kiến thức (tùy chọn)</label>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 max-h-48 overflow-y-auto">
                <div className="flex items-center mb-2">
                    <input
                        id="all-categories"
                        type="checkbox"
                        checked={selectedCategories.length === 0}
                        onChange={() => setSelectedCategories([])}
                        className="h-4 w-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                    />
                    <label htmlFor="all-categories" className="ml-2 block text-sm text-slate-800 font-medium">Tất cả kiến thức</label>
                </div>
                <hr className="my-2"/>
                {displayedCategories.map(category => (
                    <div key={category} className="flex items-center mt-1">
                        <input
                            id={category}
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategoryChange(category)}
                            className="h-4 w-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                        />
                        <label htmlFor={category} className="ml-2 block text-sm text-slate-700">{category}</label>
                    </div>
                ))}
            </div>
            {uniqueCategories.length > 5 && (
                <button type="button" onClick={() => setShowAllCategories(!showAllCategories)} className="text-sm text-sky-600 hover:underline mt-2">
                    {showAllCategories ? 'Ẩn bớt' : `Hiển thị tất cả ${uniqueCategories.length} mục`}
                </button>
            )}
          </div>
        )}

        <div>
          <label htmlFor="question-count" className="block text-sm font-medium text-slate-600">Số lượng câu hỏi</label>
          <input
            type="range"
            id="question-count"
            min="1"
            max={maxQuestions}
            value={questionCount > maxQuestions ? maxQuestions : questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-2"
          />
          <div className="flex justify-between text-sm text-slate-500 mt-1">
            <span>1</span>
            <span className="font-bold text-sky-600">{Math.min(questionCount, maxQuestions)} / {maxQuestions}</span>
            <span>{maxQuestions}</span>
          </div>
        </div>

        <div>
          <label htmlFor="time-limit" className="block text-sm font-medium text-slate-600">Thời gian (phút)</label>
          <input
            type="number"
            id="time-limit"
            min="1"
            max="180"
            value={timeLimit}
            onChange={(e) => setTimeLimit(parseInt(e.target.value, 10))}
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-transparent rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
            >
              Quay lại
            </button>
            <button
              type="submit"
              disabled={maxQuestions === 0}
              className="px-8 py-2 text-sm font-medium text-white bg-sky-600 border border-transparent rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              Bắt đầu
            </button>
        </div>
        {maxQuestions === 0 && <p className="text-center text-sm text-red-500">Không có câu hỏi nào cho lựa chọn kiến thức này.</p>}
      </form>
    </div>
  );
};

export default SetupScreen;
