import { useState, useEffect } from 'react';
import { AiOutlineLogout, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { FaThumbsUp, FaRegThumbsUp } from 'react-icons/fa';
import { useAuth } from "@/context/authContext";
import Link from 'next/link';
import ClickAwayListener from "react-click-away-listener";
import { useRouter } from 'next/router';
const Header = ({data,searchTerm, setSearchTerm,showAutocomplete, setShowAutocomplete,handleAutocompleteSelect}) => {
  const router = useRouter();
  const currentPathname = router.pathname;
  const { signOut, currentUser } = useAuth();
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() !== '') {
      const filteredResults = data.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setAutocompleteResults(filteredResults);
      setShowAutocomplete(true);
    } else {
      setShowAutocomplete(false);
      setAutocompleteResults([]);
    }
  };

  

  return (
    <>
      {currentUser ? (
        <header className="bg-me_background p-4 flex flex-wrap items-center justify-end w-full">
      {/* Desktop View */}
      <div className="hidden sm:flex items-center">
        <p className=" text-center font-bold text-3xl text-white mr-8">Welcome , <span className='bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text'>{currentUser.name}</span></p>
        <div className="relative mr-4 mb-2 sm:mb-0">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-4 pr-10 focus:outline-none focus:border-blue-500"
          />
          {showAutocomplete && (
            <ClickAwayListener onClickAway={() => setShowAutocomplete(!showAutocomplete)}>
              <ul className="absolute top-10 right-0 bg-slate-950 border border-gray-300 rounded-md shadow-md w-full z-10">
                {autocompleteResults.map((item, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 cursor-pointer hover:bg-slate-800"
                    onClick={() => handleAutocompleteSelect(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </ClickAwayListener>
          )}
        </div>
        {currentPathname !== "/SetVote" && (
          <Link
            className="bg-blue-500 text-white py-2 px-4 rounded-md flex items-center mr-4"
            href='/SetVote'
          >
            <FaThumbsUp className="mr-2" />
            Set Vote
          </Link>
        )}
        {currentPathname !== "/GiveVote" && (
          <Link
            className="bg-green-500 text-white py-2 px-4 rounded-md flex items-center mr-4"
            href='/GiveVote'
          >
            <FaRegThumbsUp className="mr-2" />
            Give Vote
          </Link>
        )}

        <button
          className="bg-red-500 text-white py-2 px-4 rounded-md flex items-center"
          onClick={signOut}
        >
          <AiOutlineLogout className="mr-2" />
          Logout
        </button>
      </div>

      {/* Mobile View */}
      <div className="flex flex-col sm:hidden items-center justify-between">
        <p className=" text-center font-bold text-3xl text-white mr-8 mb-5">Welcome , <span className='bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text'>{currentUser.name}</span></p>
        <div className="flex sm:hidden items-center justify-end">
          <div className="relative mr-4 ">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-4 pr-10 focus:outline-none focus:border-blue-500"
            />
            {showAutocomplete && (
              <ClickAwayListener onClickAway={() => setShowAutocomplete(!showAutocomplete)}>
                <ul className="absolute top-10 right-0 bg-slate-950 border border-gray-300 rounded-md shadow-md w-full z-10">
                  {autocompleteResults.map((item, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 cursor-pointer hover:bg-slate-800"
                      onClick={() => handleAutocompleteSelect(item)}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </ClickAwayListener>
            )}
          </div>
          <div className="relative">
            <button
              className="bg-gray-700 text-white py-2 px-4 rounded-md"
              onClick={() => setShowMenu(!showMenu)}
            >
              {showMenu ? (
                <AiOutlineClose />
              ) : (
                <AiOutlineMenu />
              )

              }
            </button>
            {showMenu && (
              <ClickAwayListener onClickAway={() => setShowMenu(!showMenu)}>
                <ul className="absolute top-10 right-0 bg-slate-950 border border-gray-300 rounded-md shadow-md w-40 z-10 p-2">
                  {currentPathname !== "/SetVote" && (
                    <Link className="px-4 py-2  cursor-pointer rounded-md shadow-md hover:bg-blue-600  flex items-center" href='/SetVote'><FaThumbsUp className="mr-2" />Set Vote</Link>
                  )}
                  {currentPathname !== "/GiveVote" && (
                    <Link className="px-4 py-2  cursor-pointer rounded-md shadow-md hover:bg-green-500  flex items-center" href='/GiveVote'><FaRegThumbsUp className="mr-2" />Give Vote</Link>
                  )}
                  <li className="px-4 py-2  cursor-pointer rounded-md shadow-md hover:bg-red-500 flex items-center" onClick={signOut}><AiOutlineLogout className="mr-2" />Logout</li>
                </ul>
              </ClickAwayListener>
            )}
          </div>
        </div>
      </div>
    </header>
      ):(
        <header className="bg-me_background p-4 flex flex-wrap items-center justify-end w-full">
      {/* Desktop View */}
      <div className="hidden sm:flex items-center">
        <div className="relative mr-4 mb-2 sm:mb-0">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-4 pr-10 focus:outline-none focus:border-blue-500"
          />
          {showAutocomplete && (
            <ClickAwayListener onClickAway={() => setShowAutocomplete(!showAutocomplete)}>
              <ul className="absolute top-10 right-0 bg-slate-950 border border-gray-300 rounded-md shadow-md w-full z-10">
                {autocompleteResults.map((item, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 cursor-pointer hover:bg-slate-800"
                    onClick={() => handleAutocompleteSelect(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </ClickAwayListener>
          )}
        </div>
        <Link className="px-4 py-2  cursor-pointer rounded-md shadow-md hover:bg-green-600 bg-green-500 flex items-center" href='/Login'>Login</Link>
          
      </div>

      {/* Mobile View */}
      <div className="flex flex-col sm:hidden items-center justify-between">
        <div className="flex sm:hidden items-center justify-end">
        <Link className="px-4 py-2  cursor-pointer rounded-md shadow-md hover:bg-green-600 bg-green-500 flex items-center mr-2" href='/Login'>Login</Link>
          <div className="relative ">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-4 pr-10 focus:outline-none focus:border-blue-500"
            />
            {showAutocomplete && (
              <ClickAwayListener onClickAway={() => setShowAutocomplete(!showAutocomplete)}>
                <ul className="absolute top-10 right-0 bg-slate-950 border border-gray-300 rounded-md shadow-md w-full z-10">
                  {autocompleteResults.map((item, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 cursor-pointer hover:bg-slate-800"
                      onClick={() => handleAutocompleteSelect(item)}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </ClickAwayListener>
            )}
          </div>
        </div>
      </div>
    </header>
      )}
    </>
  );
};

export default Header;
