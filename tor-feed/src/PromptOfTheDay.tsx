import React from 'react';

const PromptOfTheDay = () => {
  // Replace with actual prompt logic
  const prompt = "What is something you know today that you didn’t 3 days ago?";

  return (
    <div className="bg-white shadow rounded-lg p-4 sticky bottom-4">
      <h3 className="font-bold text-lg mb-2">Prompt of the day</h3>
      <p className="text-gray-700">{prompt}</p>
    </div>
  );
};

export default PromptOfTheDay;
