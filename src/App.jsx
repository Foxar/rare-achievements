import React from 'react';
import { TextField, Button, Typography } from '@material-ui/core';
import AchievComponent from './AchievList';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      clicked: false,
      steamid: 0,
    };
  }

  handleChange(e) {
    this.setState({ steamid: e.target.value });
  }

  render() {
    const { clicked, steamid } = this.state;
    return (

      <span>
        <div className="content">

          <div id="steamid" size="medium">
            <TextField onChange={this.handleChange} variant="filled" />
            <Button onClick={() => { this.setState({ clicked: true }); }} id="inputsend" type="submit" variant="contained" color="primary">Submit</Button>
          </div>
          <Typography variant="subtitle1">Insert steam ID64 </Typography>
        </div>

        <div className="achievCont">
          {clicked ? <AchievComponent steamid={steamid} /> : <span />}
          {console.log(`app steamid: ${steamid}`)}
        </div>

      </span>
    );
  }
}

export default App;
