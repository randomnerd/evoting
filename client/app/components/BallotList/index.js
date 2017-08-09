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
  results: 'blockchain.results',
  selected: 'blockchain.selected',
  ballots: 'blockchain.ballots'
},
class BallotList extends React.Component {
  decideRender() {
    let {account, vote, results, selected, ballots} = this.props;
    if (!account) return <KeyImport/>;
    if (selected) {
      let ballot = ballots[selected];
      if (vote) return <Vote ballot={ballot}/>;
      else if (results) return <Results ballot={ballot} />;
      else return <Ballot ballot={ballot}/>;
    }
    return <List />;
  }

  render() {
    return <div className="ui container">{this.decideRender()}</div>;
  }
});
