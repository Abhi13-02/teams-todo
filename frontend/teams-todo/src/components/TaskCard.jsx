import React from 'react';
import { format, differenceInCalendarDays } from 'date-fns';

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High': return 'badge-error';
    case 'Medium': return 'badge-warning';
    case 'Low': return 'badge-success';
    default: return 'badge-neutral';
  }
};

const TaskCard = ({ task }) => {
  const {
    title,
    description,
    priority,
    status,
    dueDate,
    assignees = []
  } = task;

  const daysLeft = differenceInCalendarDays(new Date(dueDate), new Date());
  const isDueSoon = daysLeft <= 3;

  const visibleAssignees = assignees.slice(0, 5);
  const extraAssignees = assignees.length - 5;

  return (
    <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-300">
      <div className="card-body space-y-2">

        {/* Title + Priority */}
        <div className="flex justify-between items-center">
          <h2 className="card-title text-white">{title}</h2>
          <div className={`badge ${getPriorityColor(priority)} text-white`}>{priority}</div>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm line-clamp-2">{description}</p>

        {/* Status */}
        <div className="mt-1">
          <span className="badge badge-outline badge-info text-xs">{status}</span>
        </div>

        {/* Due Date */}
        <div>
          <span className={`text-sm font-medium ${isDueSoon ? 'text-red-400' : 'text-gray-400'}`}>
            Due: {format(new Date(dueDate), 'dd MMM yyyy')}
            {isDueSoon && <span className="ml-2 animate-pulse text-red-500 font-bold">(Soon!)</span>}
          </span>
        </div>

        {/* Assignees */}
        <div className="flex items-center space-x-[-10px] mt-2">
          {visibleAssignees.map(user => (
            <div className="avatar" key={user._id}>
              <div className="w-8 rounded-full border-2 border-base-100">
                <img src={user.profilePic} alt={user.name} />
              </div>
            </div>
          ))}
          {extraAssignees > 0 && (
            <div className="avatar placeholder">
              <div className="w-8 rounded-full bg-base-300 text-sm text-white flex items-center justify-center">
                +{extraAssignees}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
