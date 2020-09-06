import React from 'react';
import PropTypes from 'prop-types';
import './App.css';
/* eslint-disable no-param-reassign */
/* eslint-disable no-tabs */
/* eslint-disable no-mixed-operators */
import Alert from '@material-ui/lab/Alert';
import {
  LinearProgress, Accordion, AccordionSummary, AccordionDetails, Typography,
} from '@material-ui/core';

class AchievComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: 0,
      items: [],
      globalAchievStats: [],
      schemaData: [],
      gamesOwned: [],
      gamesLoaded: false,
      steamid: props.steamid,
    };
  }

  componentDidMount() {
    const myInit = {
      method: 'GET',
      // mode: 'no-cors',
      cache: 'default',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (X11; rarest-achiev; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/76.0',
        'Access-Control-Allow-Origin': '*',
      },
    };

    const {
      steamid,
    } = this.state;

    fetch(`/api/getGames?steamid=${steamid}`, myInit)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        console.log('Get games error');
        return 'Getgames error';
      })
      .then((resultGames) => {
        this.setState({
          gamesOwned: resultGames,
          gamesLoaded: true,
        });


		const {
				gamesOwned
			} = this.state;



        gamesOwned.response.games = gamesOwned.response.games.filter((game) => {
          if (game.playtime_forever > 600) return true;
          return false;
        });
        for (let i = 0; i < gamesOwned.response.games.length; i += 1) {
			const {
				items, globalAchievStats, schemaData,
			} = this.state;
          const gameID = gamesOwned.response.games[i].appid;
          fetch(`/api/getAchievements?gameID=${gameID
          }&steamid=${steamid}`)
            .then((res) => res.json())
            .then(
              (result) => {
                if (result.playerstats.success && result.playerstats.achievements !== undefined) {
                  result.playerstats.achievements.forEach((item) => {
                    item.gameID = gameID;
                  });
                  for (let a = 0; a < result.playerstats.achievements.length; a += 1) {
                    result.playerstats.achievements[a].gameID = gameID;
                  }
                  if (this.state.items.playerstats === undefined) {
                    this.setState({
                      items: result,
                    });
                  } else {
                    this.state.items.playerstats.achievements = this.state.items.playerstats.achievements
                      .concat(result.playerstats.achievements);
                  }
                }
                this.setState({
                  isLoaded: this.state.isLoaded + 1,
                });
              },
              (error) => {
                this.setState({
                  isLoaded: this.state.isLoaded + 1,
                  error,
                });
              },
            );

          fetch(`/api/getAchievementPercentages?gameID=${
            gameID}&format=json&steamid=${steamid}`, myInit)
            .then((res) => res.json())
            .then(
              (result) => {
                if (result.achievementpercentages !== undefined) {
                  result.achievementpercentages.achievements.forEach((item) => {
                  item.gameID = gameID;
                });
                const tempglobalAchievStats = this.state.globalAchievStats
                .concat(result.achievementpercentages.achievements);
                this.setState({
                  globalAchievStats: tempglobalAchievStats,
                });
                }
                this.setState({
                  isLoaded: this.state.isLoaded + 1,
                });
              },
              (error) => {
                this.setState({
                  isLoaded: this.state.isLoaded + 1,
                  error,
                });
              },
            );
          fetch(`/api/getSchemaForGame?gameID=${gameID}&l=en`, myInit)
            .then((res) => res.json())
            .then(
              (result) => {
                if (result.game.gameName !== undefined
                && result.game.availableGameStats.achievements !== undefined) {
                  result.game.availableGameStats.achievements.forEach((item) => {
                    item.gameID = gameID;
                  });
                  if (this.state.schemaData.length === -1) {
                    this.setState({
                      schemaData: result,
                    });
                  } else {
                    const tempSchemaData = this.state.schemaData.concat(result);
                    this.setState({
                      schemaData:	tempSchemaData,
                    });
                  }
                }
		            this.setState({
                  isLoaded: this.state.isLoaded + 1,
                });
              },
              (error) => {
                this.setState({
                  isLoaded: this.state.isLoaded + 1,
                  error,
                });
              },
            );
        }
      },
      (error) => {
        this.setState({
          error,
        });
      });
  }

  render() {
      const {
        error, isLoaded, items, globalAchievStats, schemaData, gamesOwned, gamesLoaded,
      } = this.state;
      if (!gamesLoaded) {
        return (<LinearProgress />);
      } if (isLoaded < (3 * gamesOwned.response.games.length)) {
        if(gamesOwned.response.games === undefined)
        {
          console.log("Privacy Error");
          return <div><Alert severity="error">Failed to retrieve games playtime - game details might be private.</Alert></div>
        }
        const progress = isLoaded / (3 * gamesOwned.response.games.length) * 100;
        return (<div><LinearProgress variant="determinate" value={progress} /></div>);
      } if (error) {
        return <h1>error</h1>;
      }
      let filtered = items.playerstats.achievements.filter((item) => item.achieved);
      for (let i = 0; i < globalAchievStats.length; i += 1) {
        for (let j = 0; j < filtered.length; j += 1) {
          if (globalAchievStats[i].name === filtered[j].apiname && filtered[j].globPerc === undefined
              && globalAchievStats[i].gameID === filtered[j].gameID) {
            filtered[j].globPerc = globalAchievStats[i].percent;
          }
        }
      }
      filtered = filtered.sort((a, b) => a.globPerc - b.globPerc);
      filtered = filtered.slice(0, 10);

      for (let a = 0; a < schemaData.length; a += 1) {
        for (let i = 0; i < schemaData[a].game.availableGameStats.achievements.length; i += 1) {
          for (let j = 0; j < filtered.length; j += 1) {
            if (schemaData[a].game.availableGameStats.achievements[i].name === filtered[j].apiname
      		      && schemaData[a].game.availableGameStats.achievements[i].gameID
      		        === filtered[j].gameID) {
              filtered[j].imgurl = schemaData[a].game.availableGameStats.achievements[i].icon;
            }
          }
        }
      }

    return (
      <ul className="list">
        {filtered.map((item) => (
          <li key={item.apiname}>
            <div className="accordions">
              <Accordion TransitionProps={{ unmountOnExit: true }} square>
                <AccordionSummary
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <div className="achimgcont"><img className="achimg" src={item.imgurl} alt="Achievement icon" /></div>
                  <Typography variant="h5">{item.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div><img id="gameCover" src={`https://steamcdn-a.akamaihd.net/steam/apps/${item.gameID}/library_600x900_2x.jpg`} alt="Game cover art" /></div>
                  <div id="achievDetails">
                    <ul>
                      <li>
                        <Typography>
                          <b>Name: </b>
                          {item.name}
                        </Typography>
                      </li>
                      <li>
                        <Typography>
                          <b>Percent of players who unlocked it: </b>
                          {item.globPerc.toFixed(2)}
                          %
                        </Typography>
                      </li>
                      <li>
                        <Typography>
                          <b>Unlocked on: </b>
                          {new Date(item.unlocktime * 1000).toLocaleDateString()}
                        </Typography>
                      </li>
                      <li>
                        <Typography>
                          <b>Description: </b>
                          {item.description}
                        </Typography>
                      </li>
                    </ul>
                  </div>

                </AccordionDetails>
              </Accordion>
            </div>
          </li>
        ))}
      </ul>
    );
  }
}

AchievComponent.propTypes = {
  steamid: PropTypes.number,
};

AchievComponent.defaultProps = {
  steamid: 0,
};

export default AchievComponent;
