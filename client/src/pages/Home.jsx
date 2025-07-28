import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';

export default function Home() {
  const { token, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 

  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  useEffect(() => {
    fetchTasks();
  }, []);

 const fetchTasks = async () => {
  try {
    const { data } = await axios.get('/api/tasks');
    console.log('Fetched tasks:', data);

    if (Array.isArray(data)) {
      setTasks(data);
    } else {
      setTasks([]); 
    }

  } catch (error) {
    console.error('Error fetching tasks:', error);
    if (error.response?.status === 401) {
      logout();
    }
    setTasks([]); 
  } finally {
    setLoading(false);
  }
};
  const addTask = async (title) => {
    const { data } = await axios.post('http://localhost:5000/api/tasks', { title });
    setTasks([data, ...tasks]);
  };

  const toggleTask = async (task) => {
    const { data } = await axios.put(`http://localhost:5000/api/tasks/${task._id}`, {
      completed: !task.completed
    });
    setTasks(tasks.map(t => t._id === task._id ? data : t));
  };

  const updateTask = async (taskId, title) => {
    const { data } = await axios.put(`http://localhost:5000/api/tasks${taskId}`, { title });
    setTasks(tasks.map(t => t._id === taskId ? data : t));
  };

  const deleteTask = async (task) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await axios.delete(`http://localhost:5000/api/tasks/${task._id}`);
      setTasks(tasks.filter(t => t._id !== task._id));
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; 
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const activeCount = tasks.length - completedCount;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading your tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
     
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">My Tasks</h1>
            <p className="text-gray-600 mt-1">
              {activeCount} active, {completedCount} completed
            </p>
          </div>
          <button
            onClick={logout}
            className="btn-secondary"
          >
            Logout
          </button>
        </header>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <TaskForm onAdd={addTask} />
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            {[
              { key: 'all', label: 'All', count: tasks.length },
              { key: 'active', label: 'Active', count: activeCount },
              { key: 'completed', label: 'Completed', count: completedCount }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-3 font-medium text-sm transition-colors ${
                  filter === key
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {filter === 'all' ? 'No tasks yet. Add one above!' :
               filter === 'active' ? 'No active tasks!' :
               'No completed tasks!'}
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredTasks.map(task => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onUpdate={updateTask}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
