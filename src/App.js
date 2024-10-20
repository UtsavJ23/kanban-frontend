import React, { useEffect, useState, useRef } from "react";
import KanbanCard from "./KanbanCard";
import KanbanModal from "./KanbanModal";
import { AddIcon, BacklogIcon, CancelledIcon, DisplayIcon, DoneIcon, HighPriorityIcon, LowPriorityIcon, MediumPriorityIcon, InProgressIcon, NoPriorityIcon, UrgentPriorityIcon, TodoIcon, MenuIcon } from './assets/icons';
import { fetchTickets, fetchUsers, createTicket, updateTicket, deleteTicket } from './api';

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupBy, setGroupBy] = useState("status");
  const [sortBy, setSortBy] = useState("priority");
  const [displayDropdownOpen, setDisplayDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ticketsData, usersData] = await Promise.all([fetchTickets(), fetchUsers()]);
        setTickets(ticketsData);
        setUsers(usersData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDisplayDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const savedGroupBy = localStorage.getItem("groupBy");
    const savedSortBy = localStorage.getItem("sortBy");
    if (savedGroupBy) setGroupBy(savedGroupBy);
    if (savedSortBy) setSortBy(savedSortBy);
  }, []);

  useEffect(() => {
    localStorage.setItem("groupBy", groupBy);
    localStorage.setItem("sortBy", sortBy);
  }, [groupBy, sortBy]);

  const groupTickets = () => {
    if (groupBy === "status") {
      const statusOrder = ['Backlog', 'Todo', 'In progress', 'Done', 'Cancelled'];
      return statusOrder.reduce((acc, status) => {
        acc[status] = tickets.filter(ticket => ticket.status === status);
        return acc;
      }, {});
    } else if (groupBy === "user") {
      return users.reduce((acc, user) => {
        acc[user.name] = tickets.filter(ticket => ticket.userId === user.id);
        return acc;
      }, {});
    } else if (groupBy === "priority") {
      const priorityLevels = ["No priority", "Low", "Medium", "High", "Urgent"];
      return priorityLevels.reduce((acc, priority, index) => {
        acc[priority] = tickets.filter(ticket => ticket.priority === index);
        return acc;
      }, {});
    }
    return {};
  };

  const sortedTickets = (ticketsGroup) => {
    return ticketsGroup.sort((a, b) => {
      if (sortBy === "priority") {
        return b.priority - a.priority;
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  const getColumnIcon = (group) => {
    switch (group.toLowerCase()) {
      case 'backlog': return <BacklogIcon className="w-4 h-4" />;
      case 'in progress': return <InProgressIcon className="w-4 h-4" />;
      case 'todo': return <TodoIcon className="w-4 h-4" />;
      case 'done': return <DoneIcon className="w-4 h-4" />;
      case 'cancelled': return <CancelledIcon className="w-4 h-4" />;
      case 'no priority': return <NoPriorityIcon className="w-4 h-4" />;
      case 'low': return <LowPriorityIcon className="w-4 h-4" />;
      case 'medium': return <MediumPriorityIcon className="w-4 h-4" />;
      case 'high': return <HighPriorityIcon className="w-4 h-4" />;
      case 'urgent': return <UrgentPriorityIcon className="w-4 h-4" />;
      default: return null;
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getColorFromName = (name) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F06292', '#AED581', '#7986CB', '#4DB6AC', '#9575CD'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);
    return colors[hash % colors.length];
  };

  const groupedTickets = groupTickets();

  const handleCreateCard = () => {
    setEditingCard(null);
    setIsModalOpen(true);
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setIsModalOpen(true);
  };

  const handleSaveCard = async (cardData) => {
    try {
      setLoading(true);
      const ticketData = {
        id: cardData.id || `TKT-${Date.now()}`, // Generate a unique ID if it's a new ticket
        title: cardData.title,
        tag: cardData.tags,
        userId: cardData.userId,
        status: cardData.status,
        priority: cardData.priority
      };

      if (editingCard) {
        const updatedCard = await updateTicket(editingCard.id, ticketData);
        setTickets(tickets.map(ticket => 
          ticket.id === editingCard.id ? updatedCard : ticket
        ));
      } else {
        const newCard = await createTicket(ticketData);
        setTickets(prevTickets => [...prevTickets, newCard]);
      }
      setError(null);
      setIsModalOpen(false);
      setEditingCard(null);
    } catch (err) {
      console.error('Error saving card:', err);
      setError(`Failed to save card: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      setLoading(true);
      await deleteTicket(cardId);
      setTickets(tickets.filter(ticket => ticket.id !== cardId));
      setError(null);
    } catch (err) {
      setError("Failed to delete card. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="relative" ref={dropdownRef}>
            <button 
              className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setDisplayDropdownOpen(!displayDropdownOpen)}
            >
              <DisplayIcon className="w-4 h-4" />
              <span>Display</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {displayDropdownOpen && (
              <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">Grouping</p>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={groupBy}
                    onChange={(e) => {
                      setGroupBy(e.target.value);
                      setDisplayDropdownOpen(false);
                    }}
                  >
                    <option value="status">Status</option>
                    <option value="user">User</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">Ordering</p>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setDisplayDropdownOpen(false);
                    }}
                  >
                    <option value="priority">Priority</option>
                    <option value="title">Title</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">KanbanTracker</h1>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
            onClick={handleCreateCard}
          >
            Create
          </button>
        </div>

        <div className="flex overflow-x-auto space-x-6 pb-8">
          {Object.entries(groupedTickets).map(([group, tickets]) => (
            <div key={group} className="flex-shrink-0 w-80">
              <div className="bg-gray-100 rounded-md p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getColumnIcon(group)}
                    <h2 className="text-sm font-semibold text-gray-900">{group}</h2>
                    <span className="text-sm text-gray-500">{tickets.length}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AddIcon className="w-4 h-4 text-gray-400 cursor-pointer" onClick={handleCreateCard} />
                    <MenuIcon className="w-4 h-4 text-gray-400 cursor-pointer" onClick={toggleEditMode} />
                  </div>
                </div>
                <div className="space-y-4">
                  {sortedTickets(tickets).map(ticket => (
                    <KanbanCard
                      key={ticket.id}
                      ticket={ticket}
                      user={users.find(user => user.id === ticket.userId)}
                      groupBy={groupBy}
                      getColorFromName={getColorFromName}
                      editMode={editMode}
                      onEdit={() => handleEditCard(ticket)}
                      onDelete={() => handleDeleteCard(ticket.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <KanbanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCard}
        editingCard={editingCard}
        users={users}
      />
    </div>
  );
};

export default App;