import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip
} from 'recharts';
import LoadingScreen from '../../components/LoadingScreen';
import FloatingFilterBar from '../../components/FloatingFilterBar';
import { useSelector } from 'react-redux';

const API = import.meta.env.VITE_API_BASE_URL;

const STATUS_COLORS = {
  Todo: '#8b5cf6',         // purple
  'In Progress': '#14b8a6',// teal
  Done: '#84cc16'          // lime
};

const PRIORITY_COLORS = {
  Low: '#10b981',   // green
  Medium: '#f59e0b',// amber
  High: '#ef4444'   // red
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewFilter, setViewFilter] = useState('assigned');
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    axios.get(`${API}/tasks`, { withCredentials: true })
      .then(res => setTasks(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const assignedCount = useMemo(() =>
    tasks.filter(t => t.assignees.some(a => a._id === user._id)).length,
    [tasks, user._id]
  );

  const reportedCount = useMemo(() =>
    tasks.filter(t => t.reporter._id === user._id).length,
    [tasks, user._id]
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const isAssignee = task.assignees.some(a => a._id === user._id);
      const isReporter = task.reporter._id === user._id;

      if (viewFilter === 'assigned') return isAssignee;
      if (viewFilter === 'reported') return isReporter;
      return isAssignee || isReporter;
    });
  }, [tasks, user._id, viewFilter]);

  const total = filteredTasks.length;
  const pending = filteredTasks.filter(t => t.status === 'Todo').length;
  const inProgress = filteredTasks.filter(t => t.status === 'In Progress').length;
  const completed = filteredTasks.filter(t => t.status === 'Done').length;

  const pieData = useMemo(() => [
    { name: 'Pending', value: pending },
    { name: 'In Progress', value: inProgress },
    { name: 'Completed', value: completed },
  ], [pending, inProgress, completed]);

  const priorityCounts = useMemo(() => {
    const map = { Low: 0, Medium: 0, High: 0 };
    filteredTasks.forEach(t => map[t.priority]++);
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredTasks]);

  if (loading) return <LoadingScreen message="Loading dashboard…" />;

  return (
    <div className="p-6 space-y-8 text-white bg-gray-900 min-h-screen">
      <div>
        <h1 className="text-4xl font-bold">Good Morning, {user.name}!</h1>
        <p className="text-gray-400">{format(new Date(), "EEEE do MMM yyyy")}</p>
      </div>

      <FloatingFilterBar>
        <div className="tabs tabs-boxed">
          <button className={`tab ${viewFilter === 'assigned' ? 'tab-active' : ''}`} onClick={() => setViewFilter('assigned')}>
            Assigned to Me ({assignedCount})
          </button>
          <button className={`tab ${viewFilter === 'reported' ? 'tab-active' : ''}`} onClick={() => setViewFilter('reported')}>
            Reported by Me ({reportedCount})
          </button>
          <button className={`tab ${viewFilter === 'both' ? 'tab-active' : ''}`} onClick={() => setViewFilter('both')}>
            Both ({total})
          </button>
        </div>
      </FloatingFilterBar>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[{ label: 'Total Tasks', value: total, color: STATUS_COLORS.Todo },
          { label: 'Pending', value: pending, color: STATUS_COLORS.Todo },
          { label: 'In Progress', value: inProgress, color: STATUS_COLORS['In Progress'] },
          { label: 'Completed', value: completed, color: STATUS_COLORS.Done },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-gray-800 rounded-lg shadow p-6 flex items-center">
            <div className="w-3 h-12 rounded-full mr-4" style={{ backgroundColor: color }} />
            <div>
              <p className="text-gray-400">{label}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow text-white">
          <h2 className="text-xl font-semibold mb-4">Task Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={50}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieData.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={
                      STATUS_COLORS[
                        entry.name === 'Pending'
                          ? 'Todo'
                          : entry.name === 'In Progress'
                            ? 'In Progress'
                            : 'Done'
                      ]
                    }
                  />
                ))}
              </Pie>
              <PieTooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff', borderRadius: '0.5rem' }} itemStyle={{ color: '#fff' }} />
              <PieLegend layout="horizontal" verticalAlign="bottom" wrapperStyle={{ color: 'white' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow text-white">
          <h2 className="text-xl font-semibold mb-4">Task Priority Levels</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityCounts} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" allowDecimals={false} />
              <BarTooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff', borderRadius: '0.5rem' }} itemStyle={{ color: '#fff' }} />
              <Bar dataKey="value">
                {priorityCounts.map((entry, idx) => (
                  <Cell key={idx} fill={PRIORITY_COLORS[entry.name]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Task Table */}
      <div className="bg-gray-800 p-6 rounded-lg shadow text-white">
        <h2 className="text-xl font-semibold mb-4">Tasks</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => (
                <tr key={task._id} className="hover">
                  <td>{task.title}</td>
                  <td>
                    <span className="badge text-white" style={{ backgroundColor: STATUS_COLORS[task.status] }}>
                      {task.status}
                    </span>
                  </td>
                  <td>
                    <span className="badge text-white" style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}>
                      {task.priority}
                    </span>
                  </td>
                  <td>{format(new Date(task.dueDate), 'dd MMM yyyy')}</td>
                </tr>
              ))}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-gray-400">No tasks to show.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
