import React from 'react';
import { KnowledgeBase } from '../types';

interface KnowledgeBaseScreenProps {
    bases: KnowledgeBase[];
    onSelect: (baseId: string) => void;
    onCreate: () => void;
    onDelete: (baseId: string) => void;
}

const KnowledgeBaseScreen: React.FC<KnowledgeBaseScreenProps> = ({ bases, onSelect, onCreate, onDelete }) => {
    
    const handleDelete = (e: React.MouseEvent, baseId: string, baseName: string) => {
        e.stopPropagation(); // Prevent onSelect from being called
        if (window.confirm(`Bạn có chắc chắn muốn xóa bộ câu hỏi "${baseName}" không?`)) {
            onDelete(baseId);
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-700">Cơ sở kiến thức của bạn</h2>
                <button 
                    onClick={onCreate} 
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-600 border border-transparent rounded-md shadow-sm hover:bg-sky-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Tạo mới
                </button>
            </div>

            {bases.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-300 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-slate-800">Chưa có cơ sở kiến thức nào</h3>
                    <p className="mt-1 text-sm text-slate-500">Hãy tạo một cái mới để bắt đầu học.</p>
                    <div className="mt-6">
                        <button 
                            onClick={onCreate} 
                            className="px-5 py-2 text-sm font-medium text-white bg-sky-600 rounded-md shadow-sm hover:bg-sky-700"
                        >
                            Tạo cơ sở kiến thức đầu tiên
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bases.map(base => (
                        <div 
                            key={base.id} 
                            className="group relative bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-lg hover:border-sky-400 transition-all duration-300 flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 truncate">{base.name}</h3>
                                <p className="text-sm text-slate-500 mt-1">{base.questions.length} câu hỏi</p>
                                <p className="text-xs text-slate-400 mt-2">
                                    Tạo ngày: {new Date(base.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                 <button 
                                    onClick={() => onSelect(base.id)} 
                                    className="px-5 py-2 text-sm font-medium text-white bg-sky-600 rounded-md shadow-sm hover:bg-sky-700"
                                >
                                    Sử dụng
                                </button>
                                <button 
                                    onClick={(e) => handleDelete(e, base.id, base.name)}
                                    title="Xóa bộ câu hỏi"
                                    className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-full"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default KnowledgeBaseScreen;