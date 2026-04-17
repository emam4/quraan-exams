const JUZ_NUMBERS = Array.from({ length: 30 }, (_, i) => i + 1);

export default function JuzSelector({ selected, onChange }) {
  const toggleJuz = (juz) => {
    if (selected.includes(juz)) {
      onChange(selected.filter((j) => j !== juz));
    } else {
      onChange([...selected, juz].sort((a, b) => a - b));
    }
  };

  const selectAll = () => onChange(JUZ_NUMBERS);
  const clearAll = () => onChange([]);

  return (
    <div className="juz-selector">
      <div className="juz-selector-header">
        <span className="label">اختر الأجزاء:</span>
        <div className="juz-selector-actions">
          <button className="btn-secondary" onClick={selectAll}>الكل</button>
          <button className="btn-secondary" onClick={clearAll}>إلغاء</button>
        </div>
      </div>
      <div className="juz-grid">
        {JUZ_NUMBERS.map((juz) => (
          <button
            key={juz}
            className={`juz-btn ${selected.includes(juz) ? 'selected' : ''}`}
            onClick={() => toggleJuz(juz)}
          >
            {juz}
          </button>
        ))}
      </div>
    </div>
  );
}
