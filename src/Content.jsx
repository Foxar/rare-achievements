import React from 'react';
import './App.css';
import App from './App';
import Navbar from './Navbar'


import {Typography} from '@material-ui/core';


class Content extends React.Component{
  constructor(props){
    super(props);
    this.handlePageSwitch = this.handlePageSwitch.bind(this);
    this.state = {
      page: 0
    }
  }

  handlePageSwitch(p){
      this.setState({page: p});
  }

  render(){
    switch(this.state.page)
    {
        case 0:
        return(
            <span>

            <Typography variant="h5" align="center">Find the rarest achievements you unlocked!</Typography>
            <App/>
            //<Navbar onPageSwitch={this.handlePageSwitch} />
            </span>
        )
        break;
        case 1:
        return(
          <span>
          //<Navbar onPageSwitch={this.handlePageSwitch}/>
          <h1 class="aboutmeheader">About me</h1>
          </span>
        );
        break;
    }

  }
}


export default Content;
