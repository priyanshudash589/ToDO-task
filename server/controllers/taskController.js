import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort('-createdAt');
  res.json(tasks);
};

export const createTask = async (req, res) => {
  const { title } = req.body;
  const task = await Task.create({ title, user: req.user._id });
  res.status(201).json(task);
};

export const updateTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).json({ message: 'Not found' });

  task.title = req.body.title ?? task.title;
  if (req.body.completed !== undefined) task.completed = req.body.completed;
  await task.save();
  res.json(task);
};

export const deleteTask = async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.status(204).end();
};
