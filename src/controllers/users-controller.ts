import { asyncHandler } from '../cores/request-handler.js';

export const getUsers = asyncHandler(async (_req, res) => {
  // Simulate fetching users from a database
  throw new Error('Database connection failed'); // Simulate an error for demonstration
  res.json({ message: 'List of users' });
});
