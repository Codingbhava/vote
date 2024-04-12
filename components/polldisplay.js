import React, { useState } from 'react';
import { TiEdit ,TiDelete } from 'react-icons/ti';
import { FaPoll } from 'react-icons/fa';
import { GoAlertFill } from 'react-icons/go';
import ClickAwayListener from 'react-click-away-listener';


const PollDisplay = ({ polls, onUpdate, onDelete }) => {
    console.log(polls);
    const [selectedPoll, setSelectedPoll] = useState(null);
    const [updatedQuestion, setUpdatedQuestion] = useState('');
    const [updatedOptions, setUpdatedOptions] = useState([]);

    const handleUpdateClick = (poll) => {
        setSelectedPoll(poll);
        setUpdatedQuestion(poll.question);
        setUpdatedOptions([...poll.options]);
    };

    const handleDeleteClick = (pollId) => {
        onDelete(pollId);
    };
    const getTotalVotes = (poll) => {
        return poll.options.reduce((total, option) => total + option.votes, 0);
    };

    const handleUpdateSubmit = () => {
        if (selectedPoll) {
            // Perform the update action
            onUpdate(selectedPoll.id, updatedQuestion, updatedOptions);
            // Reset state
            setSelectedPoll(null);
            setUpdatedQuestion('');
            setUpdatedOptions([]);
        }
    };

    return (
        <div className="w-full md:w-2/3 lg:w-3/4 h-full bg-me_background p-4 md:bg-slate-800 lg:bg-slate-800 overflow-y-auto">
            <span className="text-center font-bold text-2xl mb-4 flex items-center">
                <p className='bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text'>
                    Your All Vote Polls
                </p>
                <FaPoll className='ml-4 text-common_accent'/>
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {polls.map((poll, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded">
                        <h3 className="text-white text-lg font-semibold mb-2">{poll.question}</h3>
                        {poll.update && (
                            <h4 className="text-green-500 text-xl font-semibold mb-2 flex items-center"><TiEdit className="mr-2" /> updated</h4>
                        )}
                        <p className="text-gray-300 mb-2 ">Created at {new Date(poll.createdAt.seconds * 1000).toLocaleDateString("en-US",{ weekday: "long" })}{" "}{new Date(poll.createdAt.seconds * 1000).toLocaleString()}</p>
                        <ul className="list-none">
                            {poll.options.map((option, optionIndex) => (
                                <li key={optionIndex} className="flex items-center text-white mb-1">
                                    <p className='text-gray-300 font-sans'>
                                    {option.option} - {option.votes} votes ({getTotalVotes(poll) > 0 ? ((option.votes / getTotalVotes(poll)) * 100).toFixed(2) : 0}%)
                                    </p>
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => handleUpdateClick(poll)} className="mt-2 flex items-center justify-center bg-yellow-500 text-white rounded px-2 py-1   w-full  mb-2">
                            <TiEdit className="mr-2" /> Update
                        </button>
                        <button onClick={() => handleDeleteClick(poll.id)} className="mt-2 flex items-center justify-center bg-red-500 text-white rounded px-2 py-1 w-full  mb-2">
                            <TiDelete className="mr-2" /> Delete
                        </button>
                    </div>
                ))}
            </div>
            {/* Update Modal */}
            {selectedPoll && (
                
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <ClickAwayListener onClickAway={()=>setSelectedPoll(null)}>
                    <div className="bg-me_background p-4 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Update Poll</h2>
                        <p className="text-red-500 text-xl font-semibold mb-2 flex items-center"><GoAlertFill className='mr-2'/> Remember you reset votes also by click update button</p>
                        <input
                            type="text"
                            placeholder="Enter updated question"
                            className="w-full mb-4 py-2 px-3 bg-gray-800 text-white rounded"
                            value={updatedQuestion}
                            onChange={(e) => setUpdatedQuestion(e.target.value)}
                        />
                        {updatedOptions.map((option, index) => (
                            <input
                                key={index}
                                type="text"
                                placeholder={`Option ${index + 1}`}
                                className="w-full mb-4 py-2 px-3 bg-gray-800 text-white rounded"
                                value={option.option}
                                onChange={(e) => {
                                    const newOptions = [...updatedOptions];
                                    newOptions[index] = { ...newOptions[index], option: e.target.value };
                                    setUpdatedOptions(newOptions);
                                }}
                            />
                        ))}
                        <button onClick={handleUpdateSubmit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2">Update</button>
                        <button onClick={() => setSelectedPoll(null)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Cancel</button>
                    </div>
                    </ClickAwayListener>
                </div>
                
            )}
            {/* Render RadarChart */}
            
        </div>
    );
};
export default PollDisplay;
