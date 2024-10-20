import React, { useState, useEffect } from 'react';
import { XIcon } from '@heroicons/react/solid';
import { NoPriorityIcon, LowPriorityIcon, MediumPriorityIcon, HighPriorityIcon, UrgentPriorityIcon } from './assets/icons';

const KanbanModal = ({ isOpen, onClose, onSave, editingCard = null, users }) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('Todo');
  const [priority, setPriority] = useState(0);
  const [tag, setTag] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingCard) {
      setTitle(editingCard.title);
      setStatus(editingCard.status);
      setPriority(editingCard.priority);
      setTag(editingCard.tag || []);
      setUserId(editingCard.userId);
    } else {
      resetForm();
    }
  }, [editingCard]);

  const resetForm = () => {
    setTitle('');
    setStatus('Todo');
    setPriority(0);
    setTag([]);
    setNewTag('');
    setUserId(users[0]?.id || '');
    setError('');
  };

  const handleSave = () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!userId) {
      setError('Please select a user');
      return;
    }
    const cardData = {
      id: editingCard ? editingCard.id : `TKT-${Date.now()}`,
      title: title.trim(),
      status,
      priority,
      tag,
      userId
    };
    onSave(cardData);
    onClose();
    resetForm();
  };

  const addTag = () => {
    if (newTag && !tag.includes(newTag)) {
      setTag([...tag, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTag(tag.filter(t => t !== tagToRemove));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-5 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{editingCard ? 'Edit Card' : 'Create New Card'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-4">
          {error && <div className="text-red-500">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="Backlog">Backlog</option>
              <option value="Todo">Todo</option>
              <option value="In progress">In Progress</option>
              <option value="Done">Done</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <div className="mt-1 flex space-x-2">
              {[NoPriorityIcon, LowPriorityIcon, MediumPriorityIcon, HighPriorityIcon, UrgentPriorityIcon].map((Icon, index) => (
                <button
                  key={index}
                  onClick={() => setPriority(index)}
                  className={`p-2 rounded-md ${priority === index ? 'bg-blue-100' : 'bg-gray-100'}`}
                >
                  <Icon className="w-6 h-6" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Assigned To</label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <div className="flex mt-1">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-grow rounded-l-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Add a tag"
              />
              <button
                onClick={addTag}
                className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {tag.map((t, index) => (
                <span key={index} className="bg-gray-200 px-2 py-1 rounded-md text-sm flex items-center">
                  {t}
                  <button onClick={() => removeTag(t)} className="ml-1 text-gray-500 hover:text-gray-700">
                    <XIcon className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-5">
          <button
            onClick={handleSave}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {editingCard ? 'Update Card' : 'Create Card'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KanbanModal;