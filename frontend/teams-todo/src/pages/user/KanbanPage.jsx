// src/pages/user/KanbanPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import TaskCard from '../../components/TaskCard';
import LoadingScreen from '../../components/LoadingScreen';
import FloatingFilterBar from '../../components/FloatingFilterBar';

const API = import.meta.env.VITE_API_BASE_URL;
const STATUS_KEYS = ['Todo','In Progress','Done'];

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

  // filters (if needed)...

  const { user } = useSelector(state => state.auth);

  // 1️⃣ Load data and group into columns
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

  if (loading) return <LoadingScreen message="Loading board…" />;

  // 2️⃣ Helper to sort by priority
  const sortTasks = arr => {
    if (!sortByPriority) return arr;
    return [...arr].sort(
      (a,b) =>
        ['High','Medium','Low'].indexOf(a.priority) -
        ['High','Medium','Low'].indexOf(b.priority)
    );
  };

  // 3️⃣ Handle drag end
  const onDragEnd = async result => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    // no-op if same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    setUpdating(true);
    // copy columns
    const newCols = { ...columns };
    // remove from source
    const [moved] = newCols[source.droppableId].splice(source.index, 1);
    // insert into destination
    newCols[destination.droppableId].splice(destination.index, 0, {
      ...moved,
      status: destination.droppableId
    });
    setColumns(newCols);

    // persist status change
    try {
      await axios.put(
        `${API}/tasks/${draggableId}`,
        { status: destination.droppableId },
        { withCredentials: true }
      );
    } catch {
      // rollback on error
      // put moved back
      const rollbackCols = { ...columns };
      rollbackCols[destination.droppableId].splice(destination.index, 1);
      rollbackCols[source.droppableId].splice(source.index, 0, moved);
      setColumns(rollbackCols);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="px-4 py-8 relative text-white">
      <h1 className="text-3xl font-bold mb-6">Kanban Board</h1>

      {/* filter bar (customize children) */}
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
        <div className="flex gap-4 overflow-x-auto">
          {STATUS_KEYS.map(status => (
            <Droppable droppableId={status} key={status}>
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-base-200 rounded-lg p-3 flex-1 min-w-[280px] shadow"
                >
                  <h2 className="text-xl font-semibold mb-3">{status}</h2>
                  {sortTasks(columns[status]).map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
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
