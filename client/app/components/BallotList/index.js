import '../../semantic';
import './css/styles.css';
import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'cerebral-view-react';
import Ballot from './Ballot';
import List from './List';
import Vote from './Voting';
import KeyImport from './KeyImport';
import Results from './Results';

export default connect({
  account: 'account',
  vote: 'blockchain.vote',
  results: 'blockchain.results'
},
class BallotList extends React.Component {
  static propTypes = {
    account: PropTypes.object,
    selected: PropTypes.object,
    vote: PropTypes.bool,
    results: PropTypes.bool
  };

  decideRender() {
    if (!this.props.account) return <KeyImport/>;
    if (this.props.selected) {
      if (this.props.vote) return <Vote ballot={this.props.selected}/>;
      else if (this.props.results) return <Results ballot={this.props.selected} />;
      else return <Ballot ballot={this.props.selected}/>;
    }
    return <List />;
  }

  render() {
    return <div className="ui container">{this.decideRender()}</div>;
  }
});
