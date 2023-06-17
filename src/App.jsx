import { useState } from 'react'
import './App.css'
import usageData from './data/index'
import { HorizontalBarChart } from './components/HorizontalBarChart';
import useMobileDetect from './hooks/useMobileDetect';

import { inject } from '@vercel/analytics';
 
inject();

const LeagueDropdown = ({ leagues, onSelect }) => {
  const [selectedLeague, setSelectedLeague] = useState('');

  const handleChange = (event) => {
    const selectedLeague = event.target.value;
    setSelectedLeague(selectedLeague);
    onSelect(selectedLeague);
  };

  return (
    <div>
      <select value={selectedLeague} onChange={handleChange}>
        <option value="">Select a league</option>
        {leagues.map((league) => (
          <option key={league} value={league}>
            {league}
          </option>
        ))}
      </select>
    </div>
  );
};

function App() {
  const isMobile = useMobileDetect()
  console.warn(isMobile)
  const [selectedLeague, setSelectedLeague] = useState('Rookie 1');
  const [cardFlipped, setCardFlipped] = useState(false);
  const leagueData = usageData[selectedLeague];
  const onSelect = (leagueName) => {
    setSelectedLeague(leagueName)
  }

  const handleCardClick = () => {
    setCardFlipped(!cardFlipped)
  }

  return (
    <>
      <h3>Street Fighter 6 Character Playrates</h3>

      <div className={`card ${cardFlipped ? 'flipped' : ''}`} onClick={handleCardClick}>
        {!cardFlipped && <div className="front">
          <HorizontalBarChart
            data={leagueData}
            title={`Character Play Rates for ${selectedLeague}`}
            isMobile={isMobile} />
        </div>}
        {cardFlipped && <div className="back">
          <h2>Raw Data for {selectedLeague}</h2>
          <table className='data-table'>
            <thead>
              <tr>
                <th>Character Name</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {leagueData.map((item) => (
                <tr key={item.CharacterName}>
                  <td>{item.CharacterName}</td>
                  <td>{item.Count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
    </div >

      <LeagueDropdown
        leagues={Object.keys(usageData)}
        onSelect={onSelect}>

      </LeagueDropdown>
      
      <div>
        <p>
          Data last updated on 16/06/2023
        </p>
      </div>
    </>
  )
}

export default App
