const express = require('express');
const path = require('path');

const app = express();
const fetch = require('node-fetch');
const cors = require('cors');

app.use(cors({ origin: true, credentials: true }));
app.use(express.static(path.join(__dirname, 'build')));

const myInit = {
  method: 'GET',
  // mode: 'no-cors',
  cache: 'default',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (X11; rarest-achiev; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/76.0',
  },
};

app.get('/api/ping', (req, res) => res.send('<h1>pong</h1>'));

app.get('/api/getGames', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  res.set('Content-Type', 'application/json');
  fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=D04493C2C786E67BD357F527F6EA3F3B&steamid=${
    req.query.steamid}`, myInit)
    .then((steamRes) => steamRes.json())
    .then(
      (result) => {
        console.log(req.query);
        console.log(result);
        return res.send(result);
      },
      (error) => {
        console.log(`Error owned games${req.query}`);
        console.log(error);
      },
    );
});

app.get('/api/getAchievements', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  res.set('Content-Type', 'application/json');

  console.log('Getting achievements...');
  fetch(`http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${
    req.query.gameID}&key=D04493C2C786E67BD357F527F6EA3F3B&steamid=${req.query.steamid}&l=en`, myInit)
    .then((steamRes) => steamRes.json())
    .then(
      (result) => {
        console.log(req.query);
        console.log(result);
        return res.send(result);
      },
      (error) => {
        console.log(`Error achievs${req}`);
        console.log(error);
      },
    );
});

app.get('/api/getAchievementPercentages', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  res.set('Content-Type', 'application/json');

  fetch(`http://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=${
    req.query.gameID}&key=D04493C2C786E67BD357F527F6EA3F3B&steamid=${req.query.steamid}&l=en&format=json`, myInit)
    .then((steamRes) => steamRes.json())
    .then(
      (result) => {
        console.log(req.query);
        console.log(result);
        return res.send(result);
      },
      (error) => {
        console.log(`Error global achievs${req.query}`);
        console.log(error);
      },
    );
});

app.get('/api/getSchemaForGame', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  res.set('Content-Type', 'application/json');
  fetch(`https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=D04493C2C786E67BD357F527F6EA3F3B&appid=${
    req.query.gameID}&l=en`, myInit)
    .then((steamRes) => steamRes.json())
    .then(
      (result) => {
        console.log(req.query);
        console.log(result);
        return res.send(result);
      },
      (error) => {
        console.log(`Error schema${req.query}`);
        console.log(error);
      },
    );
});

app.listen(process.env.PORT || 8080);
