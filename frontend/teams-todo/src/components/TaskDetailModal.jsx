import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatISO } from 'date-fns';
import { X, Users } from 'lucide-react';
import LoadingScreen from './LoadingScreen';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API = import.meta.env.VITE_API_BASE_URL;

export default function TaskDetailModal({
  task,
  users,
  onClose,
  onUpdated,
  onDeleted
}) {
  const { user: currentUser } = useSelector(state => state.auth);

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
  const [showAssigneeEditor, setShowAssigneeEditor] = useState(false);

  const isReporter = task?.reporter?._id === currentUser?._id;

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

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setDirty(true);
  };

  const toggleAssignee = id => {
    setForm(prev => ({
      ...prev,
      assignees: prev.assignees.includes(id)
        ? prev.assignees.filter(a => a !== id)
        : [...prev.assignees, id]
    }));
    setDirty(true);
  };

  const save = async () => {
    if (!isReporter) {
      toast.error('Only the reporter can update this task.');
      return;
    }
    setSaving(true);
    try {
      const res = await axios.put(
        `${API}/tasks/${task._id}`,
        form,
        { withCredentials: true }
      );
      onUpdated(res.data);
      setDirty(false);
      setShowAssigneeEditor(false);
      toast.success('Task updated successfully');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setDeleting(true);
    try {
      await axios.delete(`${API}/tasks/${task._id}`, { withCredentials: true });
      onDeleted(task._id);
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error('Delete failed');
      setDeleting(false);
    }
  };

  if (!task || saving || deleting) {
    return <LoadingScreen message={deleting ? 'Deleting…' : 'Saving…'} />;
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-base-200 rounded-lg shadow-xl w-full max-w-2xl mx-4 p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Task Details</h2>
            <button onClick={onClose}><X size={24} /></button>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="label-text">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="input input-bordered w-full bg-gray-800 text-white"
                disabled={!isReporter}
              />
            </div>

            {/* Description */}
            <div>
              <label className="label-text">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="textarea textarea-bordered w-full bg-gray-800 text-white"
                disabled={!isReporter}
              />
            </div>

            {/* Due Date / Priority / Status */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1">
                <label className="label-text">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-gray-800 text-white"
                  disabled={!isReporter}
                />
              </div>
              <div className="w-1/2 sm:w-1/4">
                <label className="label-text">Priority</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="select select-bordered w-full bg-gray-800 text-white"
                  disabled={!isReporter}
                >
                  {['Low', 'Medium', 'High'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="w-1/2 sm:w-1/4">
                <label className="label-text">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="select select-bordered w-full bg-gray-800 text-white"
                >
                  {['Todo', 'In Progress', 'Done'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Reporter */}
            {task.reporter && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Reporter:</span>
                <img
                  src={task.reporter.profilePic || '/default-avatar.png'}
                  alt={task.reporter.name}
                  className="w-6 h-6 rounded-full"
                />
                <span>{task.reporter.name}</span>
              </div>
            )}

            {/* Assignees */}
            <div>
              <label className="label-text">Assignees</label>
              <div className="flex items-center gap-2">
                {task.assignees.map(a => (
                  <img
                    key={a._id}
                    src={a.profilePic || '/default-avatar.png'}
                    alt={a.name}
                    title={a.name}
                    className="w-8 h-8 rounded-full border-2 border-base-200 -ml-2 first:ml-0"
                  />
                ))}
                {isReporter && (
                  <button
                    onClick={() => setShowAssigneeEditor(p => !p)}
                    className="btn btn-sm btn-outline ml-2"
                  >
                    <Users size={16} className="mr-1" />
                    Edit
                  </button>
                )}
              </div>

              {showAssigneeEditor && isReporter && (
                <div className="mt-2 bg-gray-800 p-3 rounded space-y-2 max-h-40 overflow-y-auto">
                  {users.map(u => (
                    <label key={u._id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={u._id}
                        checked={form.assignees.includes(u._id)}
                        onChange={() => toggleAssignee(u._id)}
                        className="checkbox checkbox-sm checkbox-primary"
                      />
                      <img
                        src={u.profilePic || '/default-avatar.png'}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{u.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-between">
            {isReporter && (
              <button onClick={remove} className="btn btn-outline btn-error">
                Delete
              </button>
            )}
            {dirty && (
              <button onClick={save} className="btn btn-primary ml-auto">
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
