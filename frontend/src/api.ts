const API_URL = 'http://localhost:3001';

export const fetchSubjects = async () => {
    const res = await fetch(`${API_URL}/subjects`);
    return res.json();
};

export const createSubject = async (name: string, color: string) => {
    const res = await fetch(`${API_URL}/subjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
};

export const deleteSubject = async (id: number) => {
    const res = await fetch(`${API_URL}/subjects/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
};

export const fetchTopics = async (subjectId?: number) => {
    const url = subjectId ? `${API_URL}/topics?subjectId=${subjectId}` : `${API_URL}/topics`;
    const res = await fetch(url);
    return res.json();
};

export const createTopic = async (subjectId: number, name: string) => {
    const res = await fetch(`${API_URL}/topics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectId, name }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
};

export const deleteTopic = async (id: number) => {
    const res = await fetch(`${API_URL}/topics/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
};

export const fetchFlashcards = async (subjectId?: number, topicId?: number) => {
    let url = `${API_URL}/flashcards?`;
    if (subjectId) url += `subjectId=${subjectId}&`;
    if (topicId) url += `topicId=${topicId}&`;
    const res = await fetch(url);
    return res.json();
};

export const createFlashcard = async (subjectId: number, topicId: number | null, question: string, answer: string) => {
    const res = await fetch(`${API_URL}/flashcards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectId, topicId, question, answer }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
};

export const updateFlashcard = async (id: number, updates: any) => {
    const res = await fetch(`${API_URL}/flashcards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
};

export const deleteFlashcard = async (id: number) => {
    const res = await fetch(`${API_URL}/flashcards/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
};
