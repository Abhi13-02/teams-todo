import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import TaskCard from '../../components/TaskCard';
import LoadingScreen from '../../components/LoadingScreen';
import FloatingFilterBar from '../../components/FloatingFilterBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API = import.meta.env.VITE_API_BASE_URL;

const STATUS_KEYS = ['Todo', 'In Progress', 'Done'];

const STATUS_COLORS = {
  Todo: '#38bdf8',         // Light Neon Blue
  'In Progress': '#a78bfa', // Violet (unique)
  Done: '#22c55e'           // Green
};

export default function KanbanPage() {
  const [columns, setColumns] = useState({
    Todo: [],
    'In Progress': [],
    Done: []
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [sortByPriority, setSortByPriority] = useState(false);

  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    async function load() {
      try {
        const [tRes, uRes] = await Promise.all([
          axios.get(`${API}/tasks`, { withCredentials: true }),
          axios.get(`${API}/users/all`, { withCredentials: true })
        ]);
        const tasks = tRes.data;
        const grouped = { Todo: [], 'In Progress': [], Done: [] };
        for (let task of tasks) {
          grouped[task.status]?.push(task);
        }
        setColumns(grouped);
        setUsers(uRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const sortTasks = arr => {
    if (!sortByPriority) return arr;
    return [...arr].sort(
      (a, b) =>
        ['High', 'Medium', 'Low'].indexOf(a.priority) -
        ['High', 'Medium', 'Low'].indexOf(b.priority)
    );
  };

  const onDragEnd = async result => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    const movedTask = columns[source.droppableId][source.index];
    const isAuthorized =
      movedTask.assignees.some(a => a._id === user._id) ||
      movedTask.reporter._id === user._id;

    if (!isAuthorized) {
      toast.error('Only assignees or the reporter can change the task status.');
      return;
    }

    setUpdating(true);

    const newCols = { ...columns };
    const [moved] = newCols[source.droppableId].splice(source.index, 1);
    newCols[destination.droppableId].splice(destination.index, 0, {
      ...moved,
      status: destination.droppableId
    });
    setColumns(newCols);

    try {
      await axios.put(
        `${API}/tasks/${draggableId}`,
        { status: destination.droppableId },
        { withCredentials: true }
      );
    } catch {
      // rollback
      const rollbackCols = { ...columns };
      rollbackCols[destination.droppableId].splice(destination.index, 1);
      rollbackCols[source.droppableId].splice(source.index, 0, moved);
      setColumns(rollbackCols);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingScreen message="Loading board…" />;

  return (
    <div className="px-4 py-8 relative text-white min-h-screen bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      
      <h1 className="text-3xl font-bold mb-2">Kanban Board</h1>
      <p className="text-gray-400 mb-6 text-sm sm:text-base">
        Drag and drop tasks between columns to update their status.
      </p>

      <FloatingFilterBar>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={sortByPriority}
            onChange={e => setSortByPriority(e.target.checked)}
          />
          <span>Sort by priority</span>
        </label>
      </FloatingFilterBar>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUS_KEYS.map(status => (
            <Droppable droppableId={status} key={status}>
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex-1 min-w-[280px] rounded-lg shadow p-3"
                  style={{
                    backgroundColor: `${STATUS_COLORS[status]}22`,
                    border: `2px solid ${STATUS_COLORS[status]}`
                  }}
                >
                  <h2 className="text-xl font-semibold mb-3 text-white">{status}</h2>
                  {sortTasks(columns[status]).map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {prov => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className="mb-3"
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {updating && (
        <div className="absolute inset-0 z-50">
          <LoadingScreen message="Updating task…" />
        </div>
      )}
    </div>
  );
}
