import React from 'react';
import { BacklogIcon, CancelledIcon, DoneIcon, HighPriorityIcon, LowPriorityIcon, MediumPriorityIcon, InProgressIcon, NoPriorityIcon, UrgentPriorityIcon, TodoIcon } from './assets/icons';
import { PencilIcon, TrashIcon } from '@heroicons/react/solid';

const KanbanCard = ({ ticket, user, groupBy, getColorFromName, editMode, onEdit, onDelete }) => {
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 0: return <NoPriorityIcon className="w-4 h-4" />;
      case 1: return <LowPriorityIcon className="w-4 h-4" />;
      case 2: return <MediumPriorityIcon className="w-4 h-4" />;
      case 3: return <HighPriorityIcon className="w-4 h-4" />;
      case 4: return <UrgentPriorityIcon className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'backlog': return <BacklogIcon className="w-4 h-4" />;
      case 'in progress': return <InProgressIcon className="w-4 h-4" />;
      case 'todo': return <TodoIcon className="w-4 h-4" />;
      case 'done': return <DoneIcon className="w-4 h-4" />;
      case 'cancelled': return <CancelledIcon className="w-4 h-4" />;
      default: return null;
    }
  };

  const userColor = user ? getColorFromName(user.name) : '#ccc';

  return (
    <div className={`bg-white rounded-md shadow-sm p-4 ${editMode ? 'cursor-pointer hover:bg-gray-50' : ''}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">{ticket.id}</span>
        <div className="flex items-center space-x-2">
          {groupBy !== 'user' && (
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium" style={{backgroundColor: userColor}}>
              {user ? getInitials(user.name) : '?'}
            </div>
          )}
          {editMode && (
            <>
              <PencilIcon className="w-4 h-4 text-gray-400 cursor-pointer" onClick={onEdit} />
              <TrashIcon className="w-4 h-4 text-gray-400 cursor-pointer" onClick={onDelete} />
            </>
          )}
        </div>
      </div>
      <div className="flex items-start space-x-2 mb-2">
        {groupBy !== 'status' && (
          <div className="flex-shrink-0">
            {getStatusIcon(ticket.status)}
          </div>
        )}
        <h4 className="text-sm font-medium text-gray-900 flex-grow">{ticket.title}</h4>
      </div>
      <div className="flex items-center space-x-2">
        {groupBy !== 'priority' && getPriorityIcon(ticket.priority)}
        {ticket.tags && ticket.tags.map((tag, index) => (
          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default KanbanCard;