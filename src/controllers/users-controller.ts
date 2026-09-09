import { asyncHandler } from '../cores/request-handler.js';
import { createUserSchema } from '../middlewares/use.validation.js';
import { createUser } from '../services/users-services.js';

export const cUser = asyncHandler(async (req, res) => {
  const validatedInput = createUserSchema.safeParse(req.body);
  if (!validatedInput.success) {
    return res.status(400).json({ errors: validatedInput.error.flatten().fieldErrors });
  }
  const { firstName, lastName, email, password } = validatedInput.data;
  const result = await createUser({ firstName, lastName, email, password });
  return res.status(201).json({ message: result });
});

export const getUsers = asyncHandler(async (_req, res) => {

  res.json({ message: 'List of users' });
});
