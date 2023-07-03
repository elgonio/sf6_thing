import { useState } from 'react'
import './App.css'
import usageData from './data/index'
import images from './images/index'
import countryData from './data/abridged_country_data.json'
import { HorizontalBarChart } from './components/HorizontalBarChart';
import useMobileDetect from './hooks/useMobileDetect';

import { inject } from '@vercel/analytics';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import Select from 'react-select'

inject();

const totalNumberOfPlayers = Object.values(countryData).reduce((accumulator, value) => accumulator + value.numberOfPlayers, 0);
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

const countryNames = Object.keys(countryData);
const countrySelectOptions = []
for (let i = 0; i < countryNames.length; i++) {
  const countryName = countryNames[i]
  countrySelectOptions.push({ value: countryName, label: countryName })
}

const getNHighestValues = (object, n) => {
  let sortable = [];
  for (var key in object) {
    sortable.push([key, object[key]]);
  }
  sortable.sort(function (a, b) {
    return a[1] - b[1];
  });

  return sortable.slice(-n)
}


function App() {
  const isMobile = useMobileDetect()
  const [selectedLeague, setSelectedLeague] = useState('Rookie 1');
  const [cardFlipped, setCardFlipped] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('Other');
  const leagueData = usageData[selectedLeague];

  const FavouriteCharactersPanel = () => {
    const favouriteCharacters = getNHighestValues(countryData[selectedCountry]?.character_frequency, 3)
    const listItems = favouriteCharacters.map(character => {
      return (
        <div style={{display: 'flex', justifyContent: 'space-around', flexBasis:'50%', margin:'auto'}}>
          <img src={images[character[0]]} style={{height: '3em'}}/>
          <p style={{width: '50%', textAlign: 'left'}}>
            <b>{character[0]}:</b>
            {' ' + (character[1] * 100).toFixed(2) + '% '}
          </p>
        </div>
      )
    }
    );
    return <ul>{listItems}</ul>;
  }
  const onSelect = (leagueName) => {
    setSelectedLeague(leagueName)
  }

  const handleCardClick = () => {
    setCardFlipped(!cardFlipped)
  }

  return (
    <>
      <Tabs>
        <TabList>
          <Tab>CharacterData</Tab>
          <Tab>CountryData</Tab>
        </TabList>

        <TabPanel>
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
            <p>
              P.S you can click the card to see raw numbers
            </p>
          </div>
        </TabPanel>
        <TabPanel>
          <Select options={countrySelectOptions}
            className="react-select-container"
            classNamePrefix="react-select"
            onChange={(choice) => setSelectedCountry(choice.value)} />
          <div className={`card ${cardFlipped ? 'flipped' : ''}`} onClick={handleCardClick}>
            {!cardFlipped && <div className="front">
              <div>
                <h2 className='underline'>Stats for  {selectedCountry}</h2>
                Players from {selectedCountry}s favourite characters are:
                <FavouriteCharactersPanel />
                <p >
                  {selectedCountry} has an average LP of {countryData[selectedCountry]?.mean_league_points.toFixed(2)}
                </p>
                <p>
                  Players from {selectedCountry} make up approx. {(countryData[selectedCountry]?.numberOfPlayers / totalNumberOfPlayers * 100).toFixed(2)} % of the playerbase
                </p>
              </div>
            </div>}
            {cardFlipped && <div className="back">
              <h2>Extra stats for  {selectedCountry}</h2>
              <p>
                {countryData[selectedCountry]?.numberOfPlayers} players were sampled from {selectedCountry}
              </p>
              <p>
                The LP score for players from {selectedCountry} had a standard deviation of {countryData[selectedCountry]?.std_league_points.toFixed(2)}
              </p>
            </div>}
          </div >
        </TabPanel>
      </Tabs>

    </>
  )
}

export default App
