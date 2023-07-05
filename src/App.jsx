import { useState } from 'react'
import images from './images/index'

import usageData from './data/index'
import countryData from './data/abridged_country_data.json'
import matchupData from './data/matchup_data.json';
import characterWinrates from './data/characterWinRates.json';

import useMobileDetect from './hooks/useMobileDetect';

import { inject } from '@vercel/analytics';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { HorizontalBarChart } from './components/HorizontalBarChart';
import MatchupChart from './components/MatchupChart';
import Select from 'react-select'

import './App.css'
import 'react-tabs/style/react-tabs.css';


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

const location = window.location.href.split('/')
const defaultTab = location[location.length - 1]


const tabIndices = [
  'characterData',
  'countryData',
  'matchupData',
]

const defaultTabIndex = tabIndices.indexOf(defaultTab)

console.log(defaultTab, defaultTabIndex)

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
        <div style={{ display: 'flex', flexBasis: '50%', margin: 'auto', placeContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>

            <img src={images[character[0]]} style={{ height: '3em', paddingRight: '40px' }} />
            <p style={{ textAlign: 'left', width: '200px' }}>
              <b>{character[0]}:</b>
              {' ' + (character[1] * 100).toFixed(2) + '% '}
            </p>
          </div>
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
      <h2>Some Random Street Fighter 6 Data I gathered :)</h2>
      <Tabs
        defaultIndex={defaultTabIndex >= 0 ? defaultTabIndex : 0}
        onSelect={() => setCardFlipped(false)}>
        <TabList>
          <Tab>CharacterData</Tab>
          <Tab>CountryData</Tab>
          <Tab>MatchupData</Tab>
        </TabList>

        <TabPanel>
          <h2>Street Fighter 6 Character Playrates</h2>

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
          <h2>Street Fighter 6 Stats by Country</h2>
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

          <div style={{ width: '70%', margin: 'auto' }}>
            <Select options={countrySelectOptions}
              className="react-select-container"
              classNamePrefix="react-select"
              onChange={(choice) => setSelectedCountry(choice.value)}
            />

            <div>
              <p>
                Data last updated on 26/06/2023
              </p>
              <p>
                Data is based on a representative sample of 167 830 players
              </p>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <h2>Street Fighter 6 Matchup Chart</h2>
          <div className={`card ${cardFlipped ? 'flipped' : ''}`} onClick={handleCardClick} style={{ minHeight: '400px', width: isMobile && !cardFlipped ? '1000px' : undefined }}>
            {!cardFlipped && <div className="front" style={{ height: '700px' }}>
              <MatchupChart matchupData={matchupData} />
            </div>}
            {cardFlipped && <div className="back">
              <h3>Overall Character Win Rates</h3>
              {Object.keys(characterWinrates).map((character) => <p><b>{character}:</b> {characterWinrates[character]} </p>)}
              <i>
                Tiers are determined by number of standard deviations from the mean
              </i>
            </div>}
          </div >

          <div>
            <p>
              Data last updated on 05/07/2023
            </p>
            <p>
              Data collected from 59361 matches between players at master rank
            </p>
            <p>
              P.S you can click the card to see overall winrates
            </p>
          </div>
        </TabPanel>
      </Tabs>

    </>
  )
}

export default App
