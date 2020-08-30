import React from 'react';
import logo from './logo.svg';
import './Navbar.css';

import {TextField} from '@material-ui/core';
import {Button} from '@material-ui/core';
import {ButtonGroup} from '@material-ui/core';


function Navbar(props){
  return(

      <div class="navbar">
        <div id="logo">logo</div>
        <div id="menus">
        <ButtonGroup disableElevation variant="contained" color="primary">
          <Button onClick={()=>{props.onPageSwitch(0)}}>Rarest Achievement</Button>
          <Button onClick={()=>{props.onPageSwitch(1)}}>About</Button>
        </ButtonGroup>
        </div>
        <br style={{clear:"both"}}/>
      </div>

  )
}


export default Navbar;
