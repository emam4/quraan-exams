import { useState } from 'react';

export default function QuestionCard({ question }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showMeta, setShowMeta] = useState(false);

  if (!question) return null;

  const { juz, surah, verseStart, verseEnd, answerVerses } = question;

  return (
    <div className="question-card">
      <div className="question-meta-row">
        <label className="meta-toggle">
          <input
            type="checkbox"
            checked={showMeta}
            onChange={(e) => setShowMeta(e.target.checked)}
          />
          إظهار السورة والجزء
        </label>
        {showMeta && (
          <div className="question-meta">
            <span>سورة {surah.name}</span>
            <span>الجزء {juz}</span>
          </div>
        )}
      </div>

      <p className="question-text">
        أكمل من قوله تعالى:{' '}
        <span className="verse-highlight">﴿{verseStart.text}﴾</span>
        {' '}إلى{' '}
        <span className="verse-highlight">﴿{verseEnd.text}﴾</span>
      </p>

      <button
        className="btn-show-answer"
        onClick={() => setShowAnswer((v) => !v)}
      >
        {showAnswer ? 'إخفاء الإجابة' : 'إظهار الإجابة'}
      </button>

      {showAnswer && (
        <div className="answer-block">
          <div className="answer-label">الإجابة:</div>
          <div className="answer-verses">
            {answerVerses.map((v) => (
              <div key={v.id} className="answer-verse">
                <span className="verse-num">{v.id}</span>
                <span className="verse-text">{v.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
