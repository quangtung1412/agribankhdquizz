import React from 'react';
import { QuizAttempt, QuizMode } from '../types';

interface QuizHistoryScreenProps {
    attempts: QuizAttempt[];
    onBack: () => void;
}

const QuizHistoryScreen: React.FC<QuizHistoryScreenProps> = ({ attempts, onBack }) => {
    const sortedAttempts = [...attempts].sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

    const getScoreColor = (score: number | null) => {
        if (score === null) return 'text-slate-500';
        if (score >= 80) return 'text-green-600';
        if (score >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-700">Lịch sử làm bài</h2>
                <button 
                    onClick={onBack} 
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-transparent rounded-md hover:bg-slate-200"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Quay lại
                </button>
            </div>

            {sortedAttempts.length === 0 ? (
                 <div className="text-center py-16 border-2 border-dashed border-slate-300 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-slate-800">Chưa có lịch sử</h3>
                    <p className="mt-1 text-sm text-slate-500">Hoàn thành một bài trắc nghiệm để xem lịch sử tại đây.</p>
                </div>
            ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {sortedAttempts.map(attempt => (
                        <div key={attempt.id} className="p-4 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                           <div>
                                <h3 className="font-bold text-slate-800">{attempt.knowledgeBaseName}</h3>
                                <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                                    <span>
                                        Chế độ: 
                                        <span className={`font-medium ${attempt.mode === QuizMode.Study ? 'text-blue-600' : 'text-purple-600'}`}>
                                            {attempt.mode === QuizMode.Study ? ' Học tập' : ' Thi cử'}
                                        </span>
                                    </span>
                                    <span>•</span>
                                    <span>
                                        {new Date(attempt.startedAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                           </div>
                           <div className="text-right">
                                {attempt.completedAt ? (
                                    <>
                                        <p className={`text-2xl font-bold ${getScoreColor(attempt.score)}`}>{attempt.score}%</p>
                                        <p className="text-xs text-slate-400">
                                            {attempt.userAnswers.filter(a=>a.isCorrect).length}/{attempt.userAnswers.length} đúng
                                        </p>
                                    </>
                                ) : (
                                    <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">Đang thực hiện</span>
                                )}
                           </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuizHistoryScreen;
