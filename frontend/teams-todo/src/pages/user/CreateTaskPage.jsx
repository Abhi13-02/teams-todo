import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_BASE_URL;

const CreateTaskPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    assignees: [],
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API}/users/all`, { withCredentials: true });
        setUsers(res.data);
        console.log('Fetched users:', res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();

    
  }, []);




  const toggleAssignee = (userId) => {
    setFormData((prev) => {
      const isSelected = prev.assignees.includes(userId);
      return {
        ...prev,
        assignees: isSelected
          ? prev.assignees.filter((id) => id !== userId)
          : [...prev.assignees, userId],
      };
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${API}/tasks`, formData, {
        withCredentials: true,
      });
      navigate('/app/tasks');
    } catch (err) {
      console.error('Create task error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-base-200 rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center">📝 Create Task</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="title"
          placeholder="Task title"
          className="input input-bordered w-full"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Task description"
          className="textarea textarea-bordered w-full"
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        <input
          type="date"
          name="dueDate"
          className="input input-bordered w-full"
          value={formData.dueDate}
          onChange={handleChange}
        />

        <select
          name="priority"
          className="select select-bordered w-full"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="Low">Low 🔵</option>
          <option value="Medium">Medium 🟠</option>
          <option value="High">High 🔴</option>
        </select>

        {/* Assignee Dropdown */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Select Assignees</span>
          </label>
          <div className="dropdown w-full">
            <label tabIndex={0} className="btn btn-outline w-full justify-start">
              Choose Assignees
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto"
            >
              {users.map((user) => (
                <li key={user._id}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={formData.assignees.includes(user._id)}
                      onChange={() => toggleAssignee(user._id)}
                    />
                    <img
                      src={user.profilePic || '/default-avatar.png'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border"
                    />
                    <span>{user.name}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Selected Assignees */}
        {formData.assignees.length > 0 && (
          <div className="flex items-center mt-4 -space-x-4">
            {formData.assignees.map((id) => {
              const user = users.find((u) => u._id === id);
              return (
                <img
                  key={id}
                  src={user?.profilePic || '/default-avatar.png'}
                  alt={user?.name}
                  title={user?.name}
                  className="w-10 h-10 rounded-full border-2 border-base-200"
                />
              );
            })}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-full mt-4"
          disabled={loading}
        >
          {loading ? 'Creating...' : '✅ Create Task'}
        </button>
      </form>
    </div>
  );
};

export default CreateTaskPage;
