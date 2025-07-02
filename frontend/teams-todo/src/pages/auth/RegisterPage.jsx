// src/pages/auth/RegisterPage.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/features/auth/authThunks';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const { register, handleSubmit } = useForm();

  const onSubmit = data => {
    const formData = {
      ...data,
      profilePic: data.profilePic[0] || null,
    };

    dispatch(registerUser(formData)).unwrap()
      .then(() => navigate('/app/dashboard'))
      .catch(() => {});
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-center">Create an Account</h2>
      {error && <p className="text-red-400 text-center mb-2">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm mb-2">Name</label>
          <input
            type="text"
            {...register('name')}
            required
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Email</label>
          <input
            type="email"
            {...register('email')}
            required
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Password</label>
          <input
            type="password"
            {...register('password')}
            required
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            {...register('profilePic')}
            className="w-full bg-gray-800 text-gray-300 border-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
        >
          {loading ? 'Creating...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
