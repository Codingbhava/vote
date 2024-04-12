import React, { useState } from 'react';
import { TiUpload } from 'react-icons/ti';
import { FaPoll } from 'react-icons/fa';
import { v4 as uuid } from "uuid";
import { Timestamp } from "firebase/firestore";
const PollCreation = ({ onUpload }) => {
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '']); // Minimum two options are compulsory
    const [error, setError] = useState(null);

    // Function to handle poll creation
    const handlePollCreation = async () => {
        // Check if the question and all options are filled
        if (pollQuestion.trim() === '' || pollOptions.some(option => option.trim() === '')) {
            // If any field is empty, show an error message or prevent poll creation
            setError('Please fill out all fields');
            return;
        }
        else {
            setError(null);
        }
    
        // If all fields are filled, proceed with poll creation
        const newPoll = {
            id:uuid(),
            createdAt:Timestamp.now(),
            question: pollQuestion,
            options: pollOptions.map(option => ({ option, votes: 0 })) // Initialize votes count to 0
        };
        
        onUpload(newPoll);
        // Clear input fields after upload
        setPollQuestion('');
        setPollOptions(['', '']); // Reset to initial state
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };

    const addOption = () => {
        setPollOptions([...pollOptions, '']);
    };

    const removeOption = index => {
        const newOptions = [...pollOptions];
        newOptions.splice(index, 1);
        setPollOptions(newOptions);
    };

    return (
        <div className="w-full md:w-1/3 lg:w-1/4 bg-slate-900 p-4">
            <span className="text-center font-bold text-3xl  mb-4  flex items-center">
                <p className='bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text'>
                    Upload Vote Polls
                </p>
                <FaPoll className='ml-4 text-common_accent'/>
            </span>
            <input
                type="text"
                placeholder="Enter poll question"
                className="w-full mb-4 py-2 px-3 bg-gray-800 text-white rounded"
                value={pollQuestion}
                onChange={e => setPollQuestion(e.target.value)}
            />
            {pollOptions.map((option, index) => (
                <div key={index} className="flex mb-2">
                    <input
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        className="w-full py-2 px-3 bg-gray-800 text-white rounded mr-2"
                        value={option}
                        onChange={e => handleOptionChange(index, e.target.value)}
                    />
                    {index > 1 && ( // Allow removing options if more than two options are present
                        <button onClick={() => removeOption(index)} className="py-2 px-3 bg-red-500 text-white rounded hover:bg-red-600">
                            Remove
                        </button>
                    )}
                </div>
            ))}
            {
                error && (
                    <p className="w-full py-2 px-4  text-red-500 rounded  mb-2">
                        {error}
                    </p>
                ) 
            }
            
            <button onClick={addOption} className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 mb-2">
                Add Option
            </button>
            <button onClick={handlePollCreation} className="flex items-center justify-center w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
                <TiUpload className="mr-2" />
                Create Poll
            </button>
        </div>
    );
};
export default PollCreation;