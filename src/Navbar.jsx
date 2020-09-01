import React from 'react';
import PropTypes from 'prop-types';

import './Navbar.css';

import { Button, ButtonGroup } from '@material-ui/core';

function Navbar(props) {
  return (

    <div className="navbar">
      <div id="logo">logo</div>
      <div id="menus">
        <ButtonGroup disableElevation variant="contained" color="primary">
          <Button onClick={() => { props.onPageSwitch(0); }}>Rarest Achievement</Button>
          <Button onClick={() => { props.onPageSwitch(1); }}>About</Button>
        </ButtonGroup>
      </div>
      <br style={{ clear: 'both' }} />
    </div>

  );
}

Navbar.propTypes = {
  onPageSwitch: PropTypes.number,
};

Navbar.defaultProps = {
  onPageSwitch: 0,
};

export default Navbar;
