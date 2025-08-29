import React from 'react';
import { QuizMode } from '../types';

interface MainMenuProps {
  onModeSelect: (mode: QuizMode) => void;
  onReset: () => void;
}

const ModeButton: React.FC<{ title: string; description: string; icon: JSX.Element; onClick: () => void }> = ({ title, description, icon, onClick }) => (
    <button
        onClick={onClick}
        className="group flex flex-col items-center justify-center text-center w-full sm:w-64 h-64 p-6 bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 border border-slate-200 hover:border-sky-400"
    >
        <div className="text-sky-500 group-hover:text-sky-600 transition-colors">{icon}</div>
        <h3 className="text-xl font-bold mt-4 text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500 mt-2">{description}</p>
    </button>
);

const MainMenu: React.FC<MainMenuProps> = ({ onModeSelect, onReset }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-slate-700 mb-2">Chọn chế độ</h2>
      <p className="text-slate-500 mb-8">Bạn muốn học tập hay thử sức trong một bài thi?</p>
      <div className="flex flex-col sm:flex-row gap-8">
        <ModeButton
          title="Học tập"
          description="Ôn luyện theo chủ đề, xem đáp án ngay lập tức."
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
          onClick={() => onModeSelect(QuizMode.Study)}
        />
        <ModeButton
          title="Thi cử"
          description="Làm bài thi tính giờ, xem kết quả cuối cùng."
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          onClick={() => onModeSelect(QuizMode.Exam)}
        />
      </div>
      <button onClick={onReset} className="mt-12 text-sm text-slate-500 hover:text-sky-600 hover:underline">
        Quay lại chọn cơ sở kiến thức
      </button>
    </div>
  );
};

export default MainMenu;