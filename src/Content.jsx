import React from 'react';
import './App.css';
import { Typography } from '@material-ui/core';
import App from './App';
import Navbar from './Navbar';

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.handlePageSwitch = this.handlePageSwitch.bind(this);
    this.state = {
      page: 0,
    };
  }

  handlePageSwitch(p) {
    this.setState({ page: p });
  }

  render() {
    const { page } = this.state;
    /* eslint-disable no-unreachable */
    switch (page) {
      case 0:
        return (
          <span>
            <Typography variant="h5" align="center">Find the rarest achievements you unlocked!</Typography>
            <App />
            <Navbar onPageSwitch={this.handlePageSwitch} />
          </span>
        );
        break;
      default:
        return (
          <span>
            <Navbar onPageSwitch={this.handlePageSwitch} />
            <h1 className="aboutmeheader">About me</h1>
          </span>
        );
    }
    /* eslint-enable no-unreachable */
  }
}

export default Content;
