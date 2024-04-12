import React, { useEffect, useState } from 'react';
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";
import { Loading, Header } from '@/components';
import { getDocs, collection, onSnapshot } from 'firebase/firestore';
import { DB } from '@/firebase'; 
import { FaPoll } from 'react-icons/fa';
import { TiEdit } from 'react-icons/ti'; 

export default function GiveVote() {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();
  const [polls, setPolls] = useState([]);
  const [userVotedOptions, setUserVotedOptions] = useState({});
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [usernames, setUsernames] = useState([]);
  const [searchTerm, setSearchTerm]=useState('');
  

  const extractPollsData = (users) => {
    const pollsData = [];
    users.forEach(user => {
      user.polls.forEach((poll, index) => {
        pollsData.push({
          ...poll,
          userId: user.id,
          userName: user.name, // Add user's name to poll data
        });
      });
    });
    return pollsData;
  };
  const extractVoterData = (users) => {
    const VoterData = [];
    users.forEach(user => {
      user.voters.forEach((vote, index) => {
        VoterData.push({
          ...vote,
        });
      });
    });
    return VoterData;
  };
  const getTotalVotes = (poll) => {
    return poll.options.reduce((total, option) => total + option.votes, 0);
  };

  

  // Check if the current user has already voted for the given poll
  const hasUserVoted = (pollId) => {
    return userVotedOptions.hasOwnProperty(pollId);
  };
  


  useEffect(() => {
    // Fetch polls and user's voting data
    const fetchPolls = async () => {
      try {
        if (!isLoading && !currentUser) {
          router.push("/");
        } else {
          const fetchUsernames = async () => {
            const usersRef = collection(DB, 'users');
            const usersSnapshot = await getDocs(usersRef);
            const usernames = usersSnapshot.docs.map(doc => doc.data().name);
            
            setUsernames(usernames);
          };
      
          
          const pollsCollectionRef = collection(DB, 'polls');
          // Subscribe to real-time updates using onSnapshot
          const unsubscribe = onSnapshot(pollsCollectionRef, (snapshot) => {
            const pollsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
           
            const sortedPollsData = extractPollsData(pollsData).sort((a, b) => b.createdAt - a.createdAt);
            const votedPolls = extractVoterData(pollsData);
            const votedOptions = {};
            votedPolls.forEach(poll => {
              if (poll.userId === currentUser?.id) {
                votedOptions[poll.id] = poll.option;
              }
            });
            setUserVotedOptions(votedOptions);
            setPolls(sortedPollsData);
          });

          fetchUsernames();

          // Remember to unsubscribe to the snapshot listener when component unmounts
          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error fetching polls:', error);
      }
    };

    fetchPolls();
  }, [currentUser, isLoading]);

  
  const handleAutocompleteSelect = (value) => {
    setSearchTerm(value);
    setShowAutocomplete(false);
  };
  return (
    <>
      {!currentUser ? (
        <Loading />
      ) : (
        <div className="bg-gray-900 h-screen w-full flex flex-col">
          <Header data={usernames} searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleAutocompleteSelect={handleAutocompleteSelect} setShowAutocomplete={setShowAutocomplete} showAutocomplete={showAutocomplete}/>
          <div className="w-full  h-full  p-4  overflow-y-auto">
            <span className="text-center font-bold md:text-2xl lg:text-2xl text-xl mb-4  flex items-center">
              <p className='bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text'>
                All Recently Vote Polls that you vote
              </p>
              <FaPoll className='ml-4 text-common_accent'/>
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {polls
  .filter(poll => userVotedOptions.hasOwnProperty(poll.id))
  .filter(poll => poll.userName.toLowerCase().includes(searchTerm.toLowerCase()))
  .map((poll, pollIndex) => (
    <div key={pollIndex} className="bg-gray-700 p-4 rounded">
      <p className="text-gray-300 mb-2 ">Created by <p className='text-xl text-white'>{poll.userName}</p> at {new Date(poll.createdAt.seconds * 1000).toLocaleDateString("en-US",{ weekday: "long" })}{" "}{new Date(poll.createdAt.seconds * 1000).toLocaleString()}</p>
      {poll.update && (
        <h4 className="text-green-500 text-xl font-semibold mb-2 flex items-center"><TiEdit className="mr-2" /> updated</h4>
      )}
      <h3 className=" text-lg font-semibold mb-2 text-white ">{poll.question}</h3>
      <ul className="list-none">
        {poll.options.map((option, optionIndex) => (
          <li key={optionIndex} className="flex items-center text-white mb-1">
            <p  className='text-gray-300 ml-4 font-sans '>
              {option.option} - {option.votes} votes ({getTotalVotes(poll) > 0 ? ((option.votes / getTotalVotes(poll)) * 100).toFixed(2) : 0}%)
            </p>
          </li>
        ))}
      </ul>
      
      <button
        className={`bg-green-500  text-white py-2 px-4 rounded-md mt-4 `}
      >
        {hasUserVoted(poll.id) && `You Voted for ${userVotedOptions[poll.id]}`}
      </button>
    </div>
))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
