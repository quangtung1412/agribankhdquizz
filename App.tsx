import React, { useState, useCallback, useEffect } from 'react';
import { Question, QuizMode, QuizSettings, UserAnswer, KnowledgeBase, QuizAttempt } from './types';
import FileUpload from './components/FileUpload';
import MainMenu from './components/MainMenu';
import SetupScreen from './components/SetupScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import LoginScreen from './components/LoginScreen';
import KnowledgeBaseScreen from './components/KnowledgeBaseScreen';
import QuizHistoryScreen from './components/QuizHistoryScreen';


type Screen = 'login' | 'knowledgeBase' | 'upload' | 'menu' | 'setup' | 'quiz' | 'results' | 'history';

const App: React.FC = () => {
  const [user, setUser] = useState<{ name: string; email: string; picture: string } | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<KnowledgeBase | null>(null);

  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  
  const [quizMode, setQuizMode] = useState<QuizMode | null>(null);
  const [quizSettings, setQuizSettings] = useState<QuizSettings | null>(null);
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [currentAttemptId, setCurrentAttemptId] = useState<string | null>(null);


  // LocalStorage Sync
  useEffect(() => {
    if (user) {
      const storedBases = localStorage.getItem(`quizmaster_bases_${user.email}`);
      if (storedBases) {
        setKnowledgeBases(JSON.parse(storedBases));
      }
      const storedAttempts = localStorage.getItem(`quizmaster_attempts_${user.email}`);
      if (storedAttempts) {
        setQuizAttempts(JSON.parse(storedAttempts));
      }
    } else {
      setKnowledgeBases([]);
      setQuizAttempts([]);
    }
  }, [user]);

  const saveBasesToLocalStorage = useCallback((bases: KnowledgeBase[]) => {
      if(user) {
          localStorage.setItem(`quizmaster_bases_${user.email}`, JSON.stringify(bases));
      }
  }, [user]);

  const saveAttemptsToLocalStorage = useCallback((attempts: QuizAttempt[]) => {
      if(user) {
          localStorage.setItem(`quizmaster_attempts_${user.email}`, JSON.stringify(attempts));
      }
  }, [user]);


  const handleLoginSuccess = useCallback((loggedInUser: { name: string; email: string; picture: string }) => {
    setUser(loggedInUser);
    setCurrentScreen('knowledgeBase');
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setCurrentScreen('login');
    setKnowledgeBases([]);
    setAllQuestions([]);
    setQuizMode(null);
    setQuizSettings(null);
    setActiveQuizQuestions([]);
    setUserAnswers([]);
    setQuizAttempts([]);
    setSelectedKnowledgeBase(null);
    setCurrentAttemptId(null);
  }, []);

  const handleGoToKnowledgeBase = useCallback(() => {
    setCurrentScreen('knowledgeBase');
    setAllQuestions([]);
    setQuizMode(null);
    setSelectedKnowledgeBase(null);
  }, []);

  const handleCreateNewRequest = useCallback(() => {
    setCurrentScreen('upload');
  }, []);

  const handleSaveNewBase = useCallback((name: string, questions: Question[]) => {
    const newBase: KnowledgeBase = {
      id: Date.now().toString(),
      name,
      questions,
      createdAt: new Date().toISOString(),
    };
    const updatedBases = [...knowledgeBases, newBase];
    setKnowledgeBases(updatedBases);
    saveBasesToLocalStorage(updatedBases);
    setAllQuestions(questions);
    setSelectedKnowledgeBase(newBase);
    setCurrentScreen('menu');
  }, [knowledgeBases, saveBasesToLocalStorage]);

  const handleSelectBase = useCallback((baseId: string) => {
    const selectedBase = knowledgeBases.find(b => b.id === baseId);
    if (selectedBase) {
      setAllQuestions(selectedBase.questions);
      setSelectedKnowledgeBase(selectedBase);
      setCurrentScreen('menu');
    }
  }, [knowledgeBases]);

  const handleDeleteBase = useCallback((baseId: string) => {
    const updatedBases = knowledgeBases.filter(b => b.id !== baseId);
    setKnowledgeBases(updatedBases);
    saveBasesToLocalStorage(updatedBases);
    // Also delete related attempts
    const updatedAttempts = quizAttempts.filter(a => a.knowledgeBaseId !== baseId);
    setQuizAttempts(updatedAttempts);
    saveAttemptsToLocalStorage(updatedAttempts);
  }, [knowledgeBases, saveBasesToLocalStorage, quizAttempts, saveAttemptsToLocalStorage]);


  const handleModeSelect = useCallback((mode: QuizMode) => {
    setQuizMode(mode);
    setCurrentScreen('setup');
  }, []);

  const handleStartQuiz = useCallback((settings: QuizSettings) => {
    if (!selectedKnowledgeBase) return;

    setQuizSettings(settings);
    
    let filteredQuestions = settings.categories.length > 0
      ? allQuestions.filter(q => settings.categories.includes(q.category))
      : allQuestions;

    const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, settings.questionCount);
    const initialAnswers = selectedQuestions.map(q => ({ questionId: q.id, selectedOptionIndex: null, isCorrect: null }));
    
    const newAttempt: QuizAttempt = {
        id: Date.now().toString(),
        knowledgeBaseId: selectedKnowledgeBase.id,
        knowledgeBaseName: selectedKnowledgeBase.name,
        mode: quizMode!,
        settings,
        startedAt: new Date().toISOString(),
        completedAt: null,
        userAnswers: initialAnswers,
        score: null,
    };

    const updatedAttempts = [...quizAttempts, newAttempt];
    setQuizAttempts(updatedAttempts);
    saveAttemptsToLocalStorage(updatedAttempts);
    setCurrentAttemptId(newAttempt.id);
    
    setActiveQuizQuestions(selectedQuestions);
    setUserAnswers(initialAnswers);
    setCurrentScreen('quiz');
  }, [allQuestions, selectedKnowledgeBase, quizMode, quizAttempts, saveAttemptsToLocalStorage]);

  const handleAnswerUpdate = useCallback((updatedAnswers: UserAnswer[]) => {
      if (!currentAttemptId) return;

      const updatedAttempts = quizAttempts.map(attempt => {
          if (attempt.id === currentAttemptId) {
              return { ...attempt, userAnswers: updatedAnswers };
          }
          return attempt;
      });
      setQuizAttempts(updatedAttempts);
      saveAttemptsToLocalStorage(updatedAttempts);
  }, [quizAttempts, currentAttemptId, saveAttemptsToLocalStorage]);

  const handleQuizComplete = useCallback((finalAnswers: UserAnswer[]) => {
    if(currentAttemptId) {
        const correctCount = finalAnswers.filter(a => a.isCorrect).length;
        const totalCount = finalAnswers.length;
        const score = totalCount > 0 ? parseFloat(((correctCount / totalCount) * 100).toFixed(2)) : 0;

        const updatedAttempts = quizAttempts.map(attempt => {
            if (attempt.id === currentAttemptId) {
                return { ...attempt, userAnswers: finalAnswers, completedAt: new Date().toISOString(), score };
            }
            return attempt;
        });
        setQuizAttempts(updatedAttempts);
        saveAttemptsToLocalStorage(updatedAttempts);
        setCurrentAttemptId(null);
    }
    setUserAnswers(finalAnswers);
    setCurrentScreen('results');
  }, [quizAttempts, currentAttemptId, saveAttemptsToLocalStorage]);

  const handleRestartQuiz = useCallback(() => {
    setCurrentScreen('menu');
    setQuizMode(null);
    setQuizSettings(null);
    setActiveQuizQuestions([]);
    setUserAnswers([]);
  }, []);

  const handleViewHistory = useCallback(() => setCurrentScreen('history'), []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
      case 'knowledgeBase':
        return <KnowledgeBaseScreen 
                  bases={knowledgeBases} 
                  onSelect={handleSelectBase} 
                  onCreate={handleCreateNewRequest} 
                  onDelete={handleDeleteBase} 
                  onViewHistory={handleViewHistory}
                />;
      case 'history':
        return <QuizHistoryScreen attempts={quizAttempts} onBack={handleGoToKnowledgeBase} />;
      case 'upload':
        return <FileUpload onSaveNewBase={handleSaveNewBase} onBack={handleGoToKnowledgeBase} />;
      case 'menu':
        return <MainMenu onModeSelect={handleModeSelect} onReset={handleGoToKnowledgeBase} />;
      case 'setup':
        if (!quizMode) return null;
        return <SetupScreen mode={quizMode} allQuestions={allQuestions} onStartQuiz={handleStartQuiz} onBack={handleRestartQuiz} />;
      case 'quiz':
        if (!quizSettings || activeQuizQuestions.length === 0 || !quizMode) return null;
        return <QuizScreen 
                  questions={activeQuizQuestions} 
                  settings={quizSettings} 
                  mode={quizMode} 
                  onQuizComplete={handleQuizComplete}
                  onAnswerUpdate={handleAnswerUpdate}
                />;
      case 'results':
        return <ResultsScreen questions={activeQuizQuestions} userAnswers={userAnswers} onRestart={handleGoToKnowledgeBase} />;
      default:
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 text-slate-800">
       <div className="w-full max-w-4xl mx-auto relative">
        <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-sky-700">Quiz Master</h1>
            <p className="text-slate-500 mt-2">Tạo bài trắc nghiệm từ file Excel của bạn</p>
            {user && (
              <div className="absolute top-0 right-0 flex items-center gap-3 bg-white p-2 rounded-full shadow-sm border border-slate-200">
                <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
                <span className="text-sm font-medium text-slate-600 hidden sm:inline">Chào, {user.name}</span>
                <button 
                  onClick={handleLogout} 
                  title="Đăng xuất"
                  className="p-2 text-slate-500 hover:bg-slate-100 hover:text-red-600 rounded-full transition-colors"
                  aria-label="Đăng xuất"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            )}
        </header>
        <main className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg transition-all duration-300">
           {renderScreen()}
        </main>
        <footer className="text-center mt-8 text-sm text-slate-400">
            <p>Xây dựng bởi AI. Thiết kế cho mục đích học tập và ôn luyện.</p>
        </footer>
       </div>
    </div>
  );
};

export default App;
