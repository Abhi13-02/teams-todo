// src/components/TaskDetailModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatISO } from 'date-fns';
import { X } from 'lucide-react';
import LoadingScreen from './LoadingScreen';

const API = import.meta.env.VITE_API_BASE_URL;

export default function TaskDetailModal({
  task,
  users,        // <-- pull users from props
  onClose,
  onUpdated,
  onDeleted
}) {
  // Form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: '',
    status: '',
    assignees: []
  });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Initialize form when `task` changes
  useEffect(() => {
    if (!task) return;
    setForm({
      title: task.title || '',
      description: task.description || '',
      dueDate: formatISO(new Date(task.dueDate), { representation: 'date' }),
      priority: task.priority,
      status: task.status,
      assignees: task.assignees.map(u => u._id)
    });
    setDirty(false);
  }, [task]);

  // Handle field changes
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    let v = type === 'checkbox' ? checked : value;

    if (name === 'assignees') {
      const id = value;
      v = form.assignees.includes(id)
        ? form.assignees.filter(a => a !== id)
        : [...form.assignees, id];
    }

    setForm(prev => ({ ...prev, [name]: v }));
    setDirty(true);
  };

  // Save updates
  const save = async () => {
  setSaving(true);
  try {
    const payload = { 
        title: form.title,
        description: form.description,
        dueDate: form.dueDate,
        priority: form.priority,
        status: form.status,
        assignees: form.assignees
     };
    const res = await axios.put(
      `${API}/tasks/${task._id}`,
      payload,
      { withCredentials: true }
    );
    onUpdated(res.data);
    setDirty(false);
  } catch (err) {
    console.error('Save error response:', err.response?.data);
    const msg =
      err.response?.data?.message ||
      JSON.stringify(err.response?.data) ||
      'Unknown server error';
    alert(`Unable to save: ${msg}`);
  } finally {
    setSaving(false);
  }
};


  // Delete with confirmation
  const remove = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setDeleting(true);
    try {
      await axios.delete(`${API}/tasks/${task._id}`, { withCredentials: true });
      onDeleted(task._id);
    } catch (err) {
      console.error(err);
      alert('Delete failed');
      setDeleting(false);
    }
  };

  // If no task or in mid‐save/delete, show loading
  if (!task) return null;
  if (saving || deleting) {
    return (
      <LoadingScreen
        message={deleting ? 'Deleting…' : 'Saving…'}
      />
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-base-200 rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6
                      transform transition-transform duration-200 ease-out scale-100 animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Task Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="input input-bordered w-full bg-gray-800 text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full bg-gray-800 text-white"
              rows={4}
            />
          </div>

          {/* Due Date, Priority, Status */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="input input-bordered w-full bg-gray-800 text-white"
              />
            </div>
            <div className="w-1/2 sm:w-1/4">
              <label className="block text-sm font-semibold mb-1">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="select select-bordered w-full bg-gray-800 text-white"
              >
                {['Low','Medium','High'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="w-1/2 sm:w-1/4">
              <label className="block text-sm font-semibold mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="select select-bordered w-full bg-gray-800 text-white"
              >
                {['Todo','In Progress','Done'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignees */}
          <div>
            <label className="block text-sm font-semibold mb-1">Assignees</label>
            <div className="flex flex-wrap gap-2 bg-gray-800 p-2 rounded">
              {users.map(u => {
                const checked = form.assignees.includes(u._id);
                return (
                  <label key={u._id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="assignees"
                      value={u._id}
                      checked={checked}
                      onChange={handleChange}
                      className="checkbox checkbox-sm checkbox-primary"
                    />
                    <img
                      src={u.profilePic || '/default-avatar.png'}
                      alt={u.name}
                      className="w-8 h-8 rounded-full"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-between items-center">
          <button onClick={remove} className="btn btn-outline btn-error">
            Delete
          </button>
          {dirty && (
            <button onClick={save} className="btn btn-primary">
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
