import { useState } from 'react';

export default function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!editTitle.trim() || editTitle === task.title) {
      setIsEditing(false);
      setEditTitle(task.title);
      return;
    }

    setLoading(true);
    try {
      await onUpdate(task._id, editTitle.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
      setEditTitle(task.title);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUpdate();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(task.title);
    }
  };

  return (
    <li className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex items-center flex-1 gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
        
        {isEditing ? (
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={handleKeyPress}
            className="flex-1 input py-1"
            disabled={loading}
            autoFocus
          />
        ) : (
          <span
            className={`flex-1 cursor-pointer select-none ${
              task.completed 
                ? 'line-through text-gray-400' 
                : 'text-gray-800'
            }`}
            onDoubleClick={() => setIsEditing(true)}
          >
            {task.title}
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-500 hover:text-blue-600 transition-colors"
            title="Edit task"
          >
            ✏️
          </button>
        )}
        
        <button
          onClick={() => onDelete(task)}
          className="text-gray-500 hover:text-red-600 transition-colors"
          title="Delete task"
        >
          🗑️
        </button>
      </div>
    </li>
  );
}
