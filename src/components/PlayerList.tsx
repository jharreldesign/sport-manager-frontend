import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Player } from '../types';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom'; 

const PlayerList: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const debouncedSearch = debounce((search: string) => {
    setSearchQuery(search);
  }, 500);  // Delay search by 500ms

  useEffect(() => {
    const searchParam = searchQuery ? `&search=${searchQuery}` : '';
    axios
      .get<{ players: Player[]; pagination: { totalPages: number; totalPlayers: number } }>(
        `http://localhost:3000/players?page=${currentPage}${searchParam}`
      )
      .then((response) => {
        const { players, pagination } = response.data;
        if (Array.isArray(players)) {
          setPlayers(players);
          setTotalPages(pagination.totalPages);
        } else {
          setError('Invalid data format: expected an array of players.');
        }
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching players: ' + error.message);
        setLoading(false);
      });
  }, [currentPage, searchQuery]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(event.target.value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Player List</h1>
      <input
        type="text"
        placeholder="Search by player name"
        onChange={handleSearchChange}
      />
      <ul>
        {players.map((player) => (
          <li key={player._id}>
            <Link to={`/players/${player._id}`}>
              {player.player_number} {player.first_name} {player.last_name}
            </Link>
            {player.team ? player.team.name : 'No team'} | {player.position}
          </li>
        ))}
      </ul>
      <div>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PlayerList;
