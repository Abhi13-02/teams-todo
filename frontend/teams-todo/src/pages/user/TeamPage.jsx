import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;

const TeamPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API}/users/all`, { withCredentials: true });
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch team members:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Team</h1>

      {loading ? (
        <p className="text-center text-gray-400">Loading team members...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {users.map(user => (
            <div key={user._id} className="bg-gray-900 rounded-lg p-5 shadow hover:shadow-lg transition">
              <div className="flex flex-col items-center">
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border border-gray-700 mb-4"
                />
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamPage;
