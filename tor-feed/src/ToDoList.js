import React, { useState } from 'react';

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (!newTask) return;
    setTasks([...tasks, { text: newTask, isCompleted: false }]);
    setNewTask('');
  };

  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const toggleCompletion = (index) => {
    const newTasks = tasks.map((task, i) => {
      if (i === index) {
        return { ...task, isCompleted: !task.isCompleted };
      }
      return task;
    });
    setTasks(newTasks);
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="mb-4">
        <input
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a task"
        />
        <button
          className="p-2 text-white bg-blue-500 hover:bg-blue-700 rounded"
          onClick={addTask}
        >
          Add
        </button>
      </div>
      <ul>
        {tasks.map((task, index) => (
          <li key={index} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => toggleCompletion(index)}
              className="mr-2"
            />
            <span
              className={`flex-1 ${task.isCompleted ? 'line-through' : ''}`}
            >
              {task.text}
            </span>
            <button
              onClick={() => deleteTask(index)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;
