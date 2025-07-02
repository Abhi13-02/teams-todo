// src/pages/user/ManageTasksPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../../redux/features/tasks/taskThunks';

const ManageTasksPage = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector(state => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Tasks</h2>
      {loading && <p className="text-blue-400">Loading tasks...</p>}
      {error && <p className="text-red-400">{error}</p>}

      <ul className="space-y-4">
        {tasks.map(task => (
          <li key={task._id} className="p-4 bg-gray-800 rounded-lg shadow">
            <h3 className="text-xl font-semibold">{task.title}</h3>
            <p className="text-gray-400">{task.description}</p>
            <p className="text-sm text-gray-500">Status: {task.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageTasksPage;
