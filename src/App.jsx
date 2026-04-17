import { useState } from 'react';
import JuzSelector from './components/JuzSelector';
import QuestionCard from './components/QuestionCard';
import { generateQuestion } from './utils/quranUtils';

export default function App() {
  const [selectedJuz, setSelectedJuz] = useState([]);
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = () => {
    setError('');
    setQuestion(null);

    if (!selectedJuz.length) {
      setError('الرجاء اختيار جزء واحد على الأقل');
      return;
    }

    const q = generateQuestion(selectedJuz);
    if (!q) {
      setError('تعذّر توليد السؤال، حاول مرة أخرى');
      return;
    }
    setQuestion(q);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>امتحانات القرآن الكريم</h1>
      </header>

      <main className="app-main">
        <JuzSelector selected={selectedJuz} onChange={setSelectedJuz} />

        <button
          className="btn-generate"
          onClick={handleGenerate}
          disabled={!selectedJuz.length}
        >
          توليد السؤال
        </button>

        {error && <div className="error-msg">{error}</div>}

        {/* Key forces remount to reset showAnswer state on new question */}
        {question && (
          <QuestionCard
            key={`${question.surah.id}-${question.verseStart.id}-${question.verseEnd.id}`}
            question={question}
          />
        )}
      </main>

    </div>
  );
}
