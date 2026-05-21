import { useEffect, useState } from 'react';
import { fetchSubjects, fetchTopics, fetchFlashcards, createFlashcard, deleteFlashcard } from '../api';
import { Trash2 } from 'lucide-react';

export default function FlashcardsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  
  const [subjectId, setSubjectId] = useState<number | ''>('');
  const [topicId, setTopicId] = useState<number | ''>('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubjects().then(setSubjects);
    loadCards();
  }, []);

  useEffect(() => {
    if (subjectId) {
      fetchTopics(subjectId as number).then(setTopics);
    } else {
      setTopics([]);
      setTopicId('');
    }
    loadCards();
  }, [subjectId]);

  useEffect(() => { loadCards() }, [topicId]);

  const loadCards = () => fetchFlashcards(subjectId as number || undefined, topicId as number || undefined).then(setCards);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId) return setError('Subject is required map');
    if (!question.trim() || !answer.trim()) return setError('Question and answer required');
    try {
      await createFlashcard(subjectId as number, (topicId as number) || null, question, answer);
      setQuestion('');
      setAnswer('');
      setError('');
      loadCards();
    } catch (err: any) {
      setError(err.message || 'Failed to create');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this card?')) return;
    await deleteFlashcard(id);
    loadCards();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Flashcards Base</h1>

      <form onSubmit={handleCreate} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold">New Flashcard</h2>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        
        <div className="grid grid-cols-2 gap-4">
          <select value={subjectId} onChange={e => setSubjectId(Number(e.target.value))} className="border border-gray-300 rounded px-3 py-2">
            <option value="">Select subject...</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={topicId} onChange={e => setTopicId(Number(e.target.value))} className="border border-gray-300 rounded px-3 py-2" disabled={!subjectId}>
            <option value="">Select topic (optional)...</option>
            {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        
        <div>
          <input type="text" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Question" className="w-full border border-gray-300 rounded px-3 py-2 mb-2" />
          <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Answer" className="w-full border border-gray-300 rounded px-3 py-2" rows={2} />
        </div>
        
        <button className="bg-indigo-600 text-white px-6 py-2 rounded font-medium hover:bg-indigo-700">Add Card</button>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {cards.map(c => (
          <div key={c.id} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col relative group shadow-sm">
            <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">{subjects.find(s => s.id === c.subjectId)?.name || 'Subject'}</span>
              {c.topicId && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{topics.find(t => t.id === c.topicId)?.name || 'Topic'}</span>}
            </div>
            <div className="font-semibold text-lg text-gray-900 mb-1">{c.question}</div>
            <div className="text-gray-600">{c.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
}