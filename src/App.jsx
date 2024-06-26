import React, { useEffect, useState } from 'react';

const App = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

  useEffect(() => {
    // Load search history from local storage
    const savedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setSearchHistory(savedHistory);

    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setFilteredUsers(data);  // Show all users initially
      });
  }, []);

  const handleSearch = () => {
    const results = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);

    // Add search term to history if not already present
    if (!searchHistory.includes(searchTerm)) {
      const newHistory = [...searchHistory, searchTerm];
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = () => {
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (sortDirection === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
    setFilteredUsers(sortedUsers);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchHistory([]);
    setFilteredUsers(users);
    setSortDirection('asc');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4 text-center">User Info</h1>
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleInputChange}
            className="p-2 border rounded w-full mr-2"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white p-2 rounded mr-2"
          >
            Search
          </button>
          <button
            onClick={handleSort}
            className="bg-gray-500 text-white p-2 rounded mr-2"
          >
            {sortDirection === 'asc' ? 'Sort A-Z' : 'Sort Z-A'}
          </button>
          <button
            onClick={handleClear}
            className="bg-red-500 text-white p-2 rounded"
          >
            Clear
          </button>
        </div>
        <div className="mb-4">
          <p className="text-lg font-semibold mb-2">Past Searches:</p>
          {searchHistory.map((term, index) => (
            <button
              key={index}
              onClick={() => handlePastSearch(term)}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded mr-2 mb-2 hover:bg-gray-300"
            >
              {term}
            </button>
          ))}
        </div>
        <ul>
          {filteredUsers.map(user => (
            <li key={user.id} className="mb-4 border-b pb-4">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Address:</strong> {user.address.street}, {user.address.suite}, {user.address.city}, {user.address.zipcode}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Website:</strong> {user.website}</p>
              <p><strong>Company:</strong> {user.company.name}</p>
            </li>
          ))}
        </ul>
        {filteredUsers.length === 0 && <p className="text-center">No users found</p>}
      </div>
    </div>
  );
};

export default App;
