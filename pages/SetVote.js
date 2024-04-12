import React, { useState, useEffect } from 'react';
import { useAuth } from "@/context/authContext";
import { Loading, Header,PollCreation,PollDisplay } from '@/components';
import { useRouter } from "next/router";
import { DB } from "@/firebase";
import { doc, setDoc,getDoc ,updateDoc,arrayUnion,onSnapshot } from "firebase/firestore";

const SetVote = () => {
    const { currentUser, isLoading } = useAuth();
    const router = useRouter();
    const [polls, setPolls] = useState([]);
    const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm]=useState('');
    const handleAutocompleteSelect = (value) => {
        setSearchTerm(value);
        setShowAutocomplete(false);
      };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!isLoading && !currentUser) {
                    router.push("/");
                } else {
                    const userDocPollsRef = doc(DB, "polls", currentUser.id);
                    const unsubscribe = onSnapshot(userDocPollsRef, (doc) => {
                        if (doc.exists()) {
                            const userPolls = doc.data().polls;
                            setPolls(userPolls);
                            // Extracting questions from polls and storing them
                            const extractedQuestions = userPolls.map(poll => poll.question);
                            setQuestions(extractedQuestions);
                        } else {
                            setPolls([]);
                        }
                    });
                    return () => unsubscribe();
                }
            } catch (error) {
                console.error("Error fetching polls:", error);
            }
        };

        fetchData();
    }, [currentUser, isLoading, router]);

    const handleDelete = async (pollId) => {
        try {
            const userDocPollsRef = doc(DB, "polls", currentUser.id);
            const userDocPollsSnapshot = await getDoc(userDocPollsRef);
            if (userDocPollsSnapshot.exists()) {
                const userPolls = userDocPollsSnapshot.data().polls;
                const updatedPolls = userPolls.filter(poll => poll.id !== pollId);
                await updateDoc(userDocPollsRef, {
                    polls: updatedPolls,
                });
            }
        } catch (error) {
            console.error("Error deleting poll:", error);
        }
    };
    const handleUpload = async (newPoll) => {
        try {
            const userDocPollsRef = doc(DB, "polls", currentUser.id);
            const userDocPollsSnapshot = await getDoc(userDocPollsRef);
            if (userDocPollsSnapshot.exists()) {
                await updateDoc(userDocPollsRef, {
                    polls: arrayUnion(newPoll),
                });
            } else {
                await setDoc(userDocPollsRef, {
                    email: currentUser.email,
                    userId: currentUser.id,
                    name: currentUser.name,
                    polls: [newPoll],
                    voters:[]
                });
            }
            // No need to manually update state here, it will automatically update due to the realtime subscription.
        } catch (error) {
            console.error("Error uploading poll:", error);
        }
    };

    
    const handleUpdate = async (pollId, updatedQuestion, updatedOptions) => {
        try {
            const userDocPollsRef = doc(DB, "polls", currentUser.id);
            const userDocPollsSnapshot = await getDoc(userDocPollsRef);
            if (userDocPollsSnapshot.exists()) {
                const userPolls = userDocPollsSnapshot.data().polls;
                const updatedPolls = userPolls.map(poll => {
                    if (poll.id === pollId) {
                        // Reset votes for all options
                        const resetOptions = updatedOptions.map(option => ({ ...option, votes: 0 }));
                        return {
                            ...poll,
                            question: updatedQuestion,
                            options: resetOptions,
                            update:true,
                            
                        };
                    }
                    return poll;
                });
                await updateDoc(userDocPollsRef, {
                    polls: updatedPolls,
                    voters:[]
                });
            }
        } catch (error) {
            console.error("Error updating poll:", error);
        }
    };
    const filteredPolls = polls.filter(poll =>
        poll.question.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <>
            {!currentUser ? (
                <Loading />
            ) : (
                <div className="bg-gray-900 h-screen w-full flex flex-col">
                <Header data={questions} searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleAutocompleteSelect={handleAutocompleteSelect} setShowAutocomplete={setShowAutocomplete} showAutocomplete={showAutocomplete}/>
          <div className="h-full w-full flex flex-wrap">
                        <PollCreation onUpload={handleUpload} />
                        <PollDisplay polls={filteredPolls} onUpdate={handleUpdate} onDelete={handleDelete}/> {/* Pass onUpdate function */}
                    </div>
                </div>
            )}
        </>
    );
};


export default SetVote;

