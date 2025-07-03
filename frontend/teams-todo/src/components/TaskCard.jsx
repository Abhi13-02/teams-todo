import React from 'react';
import { format, differenceInCalendarDays } from 'date-fns';

const STATUS_COLORS = {
  Todo: { bg: 'bg-[#e0f2fe]', border: 'border-[#38bdf8]', text: 'text-[#0ea5e9]' },
  'In Progress': { bg: 'bg-[#ede9fe]', border: 'border-[#a78bfa]', text: 'text-[#7c3aed]' },
  Done: { bg: 'bg-[#dcfce7]', border: 'border-[#22c55e]', text: 'text-[#15803d]' }
};

const PRIORITY_COLORS = {
  High: { bg: 'bg-[#fee2e2]', border: 'border-[#ef4444]', text: 'text-[#b91c1c]' },
  Medium: { bg: 'bg-[#fef3c7]', border: 'border-[#f59e0b]', text: 'text-[#b45309]' },
  Low: { bg: 'bg-[#fefce8]', border: 'border-[#eab308]', text: 'text-[#92400e]' }
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

  const priorityStyle = PRIORITY_COLORS[priority] || {};
  const statusStyle = STATUS_COLORS[status] || {};

  return (
    <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-300">
      <div className="card-body space-y-2">

        {/* Title + Priority Badge */}
        <div className="flex justify-between items-center">
          <h2 className="card-title text-white text-base sm:text-lg">{title}</h2>
          <span
            className={`badge px-3 py-1 border ${priorityStyle.bg} ${priorityStyle.border} ${priorityStyle.text} text-xs sm:text-sm font-medium`}
          >
            {priority}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm line-clamp-2">{description}</p>

        {/* Status Badge */}
        <div className="mt-1">
          <span
            className={`badge px-3 py-1 border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text} text-xs sm:text-sm font-medium`}
          >
            {status}
          </span>
        </div>

        {/* Due Date */}
        <div>
          <span className={`text-sm font-medium ${isDueSoon ? 'text-red-400' : 'text-gray-400'}`}>
            Due: {format(new Date(dueDate), 'dd MMM yyyy')}
            {isDueSoon && (
              <span className="ml-2 animate-pulse text-red-500 font-bold">(Soon!)</span>
            )}
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
