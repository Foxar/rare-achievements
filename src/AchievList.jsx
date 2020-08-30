import React from 'react';
import './App.css';

import { TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { LinearProgress } from '@material-ui/core';
import { Accordion } from '@material-ui/core';
import { AccordionSummary } from '@material-ui/core';
import { AccordionDetails } from '@material-ui/core';
import { Typography } from '@material-ui/core';

class AchievComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: 0,
      isLoading: false,
      items: [],
      globalAchievStats: [],
      schemaData: [],
      gamesOwned: [],
      gamesLoaded: false,
      steamid: props.steamid
    };
  }
  componentDidUpdate() {

  }

  componentDidMount() {
    const myInit = {
      method: 'GET',
      //mode: 'no-cors',
      cache: 'default',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (X11; rarest-achiev; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/76.0',
        'Access-Control-Allow-Origin': '*'
      },
    };

    //let proxy = "https://cors-anywhere.herokuapp.com/";
    let proxy = "";
    console.log("first fetch");
    //fetch(proxy + "http://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=D04493C2C786E67BD357F527F6EA3F3B&steamid=" +
    fetch("http://localhost:8080/getGames?steamid=" + this.state.steamid, myInit)
      .then(res => {
        console.log("games res");
        if (res.ok) {
          return res.json();
        } else {
          console.log("Error");
          console.log(res);
        }
      })
      .then(
        (result) => {
          console.log("setting state");
          this.setState({
            gamesOwned: result,
            gamesLoaded: true
          });

          console.log("Result");

          this.state.gamesOwned.response.games =
            this.state.gamesOwned.response.games.filter(game => { if (game.playtime_forever > 600) return true; else return false; });

          //this.state.gamesOwned.response.games = this.state.gamesOwned.response.games.slice(0,20);

          console.log(this.state.gamesOwned.response.games);
          for (var i = 0; i < this.state.gamesOwned.response.games.length; i++) {
            //if(false)

            //this.state.gamesOwned.response.games[i].appid

            //let gameID = 391220;
            console.log("Gonna fetch");
            let gameID = this.state.gamesOwned.response.games[i].appid;
            fetch("http://localhost:8080/getAchievements?gameID=" + gameID +
              "&steamid=" + this.state.steamid)
              .then(res => res.json())
              .then(
                (result) => {
                  console.log(result);


                  if (result.playerstats.success && result.playerstats.achievements != undefined) {
                    result.playerstats.achievements.forEach((item, i) => {
                      item.gameID = gameID
                    });
                    for (var a = 0; a < result.playerstats.achievements.length; a++) {
                      result.playerstats.achievements[a].gameID = gameID;
                    }
                    console.log(result);
                    if (this.state.items.playerstats === undefined) {
                      this.setState({
                        items: result,
                        isLoaded: this.state.isLoaded + 1
                      });
                    } else {
                      this.state.items.playerstats.achievements = this.state.items.playerstats.achievements.
                        concat(result.playerstats.achievements);
                    }


                  }
                  this.setState({
                    isLoaded: this.state.isLoaded + 1
                  });
                  //this.state.items.
                },
                (error) => {
                  this.setState({
                    isLoaded: this.state.isLoaded + 1,
                    error
                  });
                }
              )
            //console.log(typeof(this.state.items));


            fetch("http://localhost:8080/getAchievementPercentages?gameID=" +
              gameID + "&format=json&steamid=" + this.state.steamid, myInit)
              .then(res => res.json())
              .then(
                (result) => {
                  console.log(result);




                  if (result.achievementpercentages === undefined) {

                    console.log("RESULT EMPTY");
                    this.setState({
                      isLoaded: this.state.isLoaded + 1
                    });

                  }
                  else {
                    result.achievementpercentages.achievements.forEach((item, i) => {
                      item.gameID = gameID;
                    });

                    console.log("Achiev stats for game " + gameID);
                    console.log(this.state.globalAchievStats);
                    this.state.globalAchievStats =
                      this.state.globalAchievStats.
                        concat(result.achievementpercentages.achievements);
                    console.log(this.state.globalAchievStats);
                    this.setState({
                      isLoaded: this.state.isLoaded + 1
                    })

                  }
                },
                (error) => {
                  this.setState({
                    isLoaded: this.state.isLoaded + 1,

                    error
                  });
                }
              )

            //console.log(typeof(this.state.globalAchievStats));

            fetch("http://localhost:8080/getSchemaForGame?gameID=" + gameID + "&l=en", myInit)
              .then(res => res.json())
              .then(
                (result) => {
                  console.log(result);



                  if (result.game.gameName == undefined || result.game.availableGameStats.achievements == undefined) {
                    this.setState({
                      isLoaded: this.state.isLoaded + 1,
                    });
                  }
                  else {
                    result.game.availableGameStats.achievements.forEach((item, i) => {
                      item.gameID = gameID;
                    });
                    console.log(result.game);
                    if (this.state.schemaData.length == -1) {
                      this.setState({
                        isLoaded: this.state.isLoaded + 1,
                        schemaData: result,
                      });
                    }
                    else {
                      console.log(this.state.schemaData);
                      this.state.schemaData = this.state.schemaData.concat(result);
                      this.setState({
                        isLoaded: this.state.isLoaded + 1,
                      });

                    }
                  }
                },
                (error) => {
                  this.setState({
                    isLoaded: this.state.isLoaded + 1,
                    error
                  });
                }
              )


          }
        },
        (error) => {
          this.setState({
            error
          });
        }
      )

  }



  render() {
    console.log(this.state.gamesOwned);
    const { error, isLoaded, items, globalAchievStats, schemaData } = this.state;
    if (!this.state.gamesLoaded) {
      return (<LinearProgress />);
    } else if (isLoaded < (3 * this.state.gamesOwned.response.games.length)) {
      console.log(isLoaded);
      var progress = isLoaded / (3 * this.state.gamesOwned.response.games.length) * 100
      console.log(progress);
      return (<div><LinearProgress variant="determinate" value={progress} /></div>);
    } else if (error) {
      console.log(error);
      return <h1>error</h1>;
    }
    else {


      console.log(items);
      var filtered = items.playerstats.achievements.filter(item => item.achieved);
      console.log(globalAchievStats);
      for (var i = 0; i < globalAchievStats.length; i++) {
        for (var j = 0; j < filtered.length; j++) {
          if (globalAchievStats.[i].name == filtered[j].apiname && filtered[j].globPerc == undefined &&
            globalAchievStats.[i].gameID == filtered[j].gameID) {
            console.log(globalAchievStats[i]);
            console.log(filtered[j]);
            console.log("Setting " + filtered[j].apiname + " to " + globalAchievStats[i].percent + "with i " + i);
            filtered[j].globPerc = globalAchievStats[i].percent;
          }
        }
      }
      filtered = filtered.sort((a, b) => { return a.globPerc - b.globPerc; });
      filtered = filtered.slice(0, 10);

      console.log(filtered);

      for (var a = 0; a < schemaData.length; a++) {
        console.log(a);
        for (var i = 0; i < schemaData[a].game.availableGameStats.achievements.length; i++) {
          for (var j = 0; j < filtered.length; j++) {
            if (schemaData[a].game.availableGameStats.achievements[i].name == filtered[j].apiname &&
              schemaData[a].game.availableGameStats.achievements[i].gameID == filtered[j].gameID) {
              filtered[j].imgurl = schemaData[a].game.availableGameStats.achievements[i].icon;
            }
          }
        }
      }



      return (
        <ul class="list">
          {filtered.map(item => (
            <li key={item.apiname}>
              <div class="accordions">
                <Accordion TransitionProps={{ unmountOnExit: true }} square>
                  <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                    <div class="achimgcont"><img class="achimg" src={item.imgurl} /></div>
                    <Typography variant="h5">{item.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div><img id="gameCover" src={"https://steamcdn-a.akamaihd.net/steam/apps/" + item.gameID + "/library_600x900_2x.jpg"} /></div>
                    <div id="achievDetails">
                      <ul>
                        <li><Typography><b>Name: </b>{item.name}</Typography></li>
                        <li><Typography><b>Percent of players who unlocked it: </b>{item.globPerc.toFixed(2)}%</Typography></li>
                        <li><Typography><b>Unlocked on: </b>{new Date(item.unlocktime * 1000).toLocaleDateString()}</Typography></li>
                        <li><Typography><b>Description: </b>{item.description}</Typography></li>
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

}

export default AchievComponent;
