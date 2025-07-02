// src/pages/auth/LoginPage.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/features/auth/authThunks';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const { register, handleSubmit } = useForm();

  const onSubmit = data => {
    dispatch(loginUser(data)).unwrap()
      .then(() => navigate('/app/dashboard'))
      .catch(() => {});
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-center">Welcome Back</h2>
      {error && <p className="text-red-400 text-center mb-2">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm mb-2">Email address</label>
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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
