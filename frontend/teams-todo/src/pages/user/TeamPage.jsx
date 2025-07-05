import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../redux/features/users/userThunks';

const TeamPage = () => {
  const dispatch = useDispatch();

  const { users, loading, error } = useSelector(state => state.users);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Team</h1>

      {loading ? (
        <p className="text-center text-gray-400">Loading team members...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {users.map(user => (
            <div
              key={user._id}
              className="bg-gray-900 rounded-lg p-5 shadow hover:shadow-lg transition"
            >
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
