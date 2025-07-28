import { useState } from 'react';

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title);
    setTitle('');
  };
  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        className="flex-1 input"
        placeholder="New task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button className="btn-primary">Add</button>
    </form>
  );
}
