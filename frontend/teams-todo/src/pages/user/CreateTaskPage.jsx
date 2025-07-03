import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const API = import.meta.env.VITE_API_BASE_URL;

// 🔐 Zod Schema with full validation
const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  dueDate: z
    .string()
    .min(1, 'Due date is required')
    .refine((date) => {
      const selected = new Date(date);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return selected >= now;
    }, {
      message: 'Due date cannot be in the past',
    }),
  priority: z.enum(['Low', 'Medium', 'High'], {
    required_error: 'Priority is required',
  }),
  assignees: z.array(z.string()).min(1, 'Select at least one assignee'),
});

const CreateTaskPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
      assignees: [],
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API}/users/all`, { withCredentials: true });
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

  const toggleAssignee = (userId) => {
    const current = getValues('assignees') || [];
    const updated = current.includes(userId)
      ? current.filter((id) => id !== userId)
      : [...current, userId];
    setValue('assignees', updated, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await axios.post(`${API}/tasks`, data, { withCredentials: true });
      navigate('/app/tasks');
    } catch (err) {
      console.error('Create task error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-6 py-8 bg-base-200 shadow-xl rounded-2xl">
      <h2 className="text-4xl font-extrabold text-center mb-8 text-primary">📝 Create New Task</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Title */}
        <div className="w-full">
          <input
            type="text"
            placeholder="Enter Task Title"
            className="input input-bordered w-full"
            {...register('title')}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        {/* Priority */}
        <div className="w-full">
          <select className="select select-bordered w-full" {...register('priority')}>
            <option value="Low">🔵 Low</option>
            <option value="Medium">🟠 Medium</option>
            <option value="High">🔴 High</option>
          </select>
          {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>}
        </div>

        {/* Due Date */}
        <div className="w-full">
          <input
            type="date"
            className="input input-bordered w-full"
            {...register('dueDate')}
          />
          {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>}
        </div>

        {/* Assignees */}
        <div className="w-full">
          <div className="dropdown w-full">
            <label tabIndex={0} className="btn btn-outline w-full bg-base-100">
              Choose Assignees
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow-md bg-base-100 rounded-box w-full max-h-60 overflow-y-auto"
            >
              {users.map((user) => (
                <li key={user._id}>
                  <label className="flex items-center gap-3 cursor-pointer px-2 py-1">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={getValues('assignees').includes(user._id)}
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
          {errors.assignees && <p className="text-red-500 text-sm mt-1">{errors.assignees.message}</p>}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <textarea
            placeholder="Enter task description..."
            className="textarea textarea-bordered w-full min-h-[120px]"
            {...register('description')}
          ></textarea>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        {/* Selected Assignees */}
        {getValues('assignees').length > 0 && (
          <div className="md:col-span-2 flex items-center flex-wrap gap-3">
            {getValues('assignees').map((id) => {
              const user = users.find((u) => u._id === id);
              return (
                <div key={id} className="tooltip" data-tip={user?.name}>
                  <img
                    src={user?.profilePic || '/default-avatar.png'}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full border-2 border-primary"
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary w-full md:col-span-2"
          disabled={loading}
        >
          {loading ? 'Creating Task...' : '✅ Create Task'}
        </button>
      </form>
    </div>
  );
};

export default CreateTaskPage;
