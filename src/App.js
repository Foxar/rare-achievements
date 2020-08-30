import React from 'react';
import AchievComponent from './AchievList';
import logo from './logo.svg';
import './App.css';

import {TextField} from '@material-ui/core';
import {Button} from '@material-ui/core';
import {Typography} from '@material-ui/core';



class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      clicked: false,
      steamid: 0
    };
  }

handleChange(e) {

  this.setState({steamid: e.target.value});
}

render(){
  return(

      <span>
      <div class = "content">

          <div id ="steamid" size = "medium">
              <TextField onChange={this.handleChange} variant="filled"/>
              <Button onClick={()=>{this.setState({clicked: true})}} id="inputsend"  type="submit" variant="contained" color="primary" >Submit</Button>
          </div>
          <Typography variant="subtitle1">Insert steam ID64 </Typography>
      </div>

          <div class = "achievCont">
          {this.state.clicked? <AchievComponent steamid={this.state.steamid}/> :<span/>}
          {console.log("app steamid: " + this.state.steamid)}
          </div>

      </span>
      )
    }
}



export default App;
