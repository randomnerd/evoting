import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'cerebral-view-react';
import moment from 'moment';

export default connect({
  ballots: 'blockchain.ballots'
},
class BallotList extends React.Component {
  static propTypes = { ballots: PropTypes.object };
  getVote(adr){
    const signals = this.props.signals.blockchain;
    signals.ballotSelected(adr);
    signals.voteSelected();
  }
  voteButton(meet){
    const signals = this.props.signals.blockchain;
    return(
      <a className='ui blue button' onClick={this.getVote.bind(this, {addr: meet.addr})}>
        <i className='checkmark box icon'></i>
        Голосовать
      </a>
    )
  }
  getResults(adr){
    this.props.signals.blockchain.ballotSelected(adr);
    this.props.signals.blockchain.resultsSelected();
  }
  finishedButton(meet){
    return(
      <a className='ui blue button' onClick={this.getResults.bind(this, {addr: meet.addr})}>
        <i className='checkmark box icon'></i>
        Результаты
      </a>
    )
  }
  renderItem(ballot) {
    const signals = this.props.signals.blockchain;
    let button = null;
    if (ballot.voterInfo) {
      if (ballot.voterInfo.votedAt > 0) button = this.finishedButton(ballot);
      else button = this.voteButton(ballot);
    }
    return (
      <tr key={ballot.addr}>
        <td>{ballot.name}</td>
        <td>{ballot.issuerName.toUtf8()}</td>
        <td>{moment(ballot.startAt).format("DD.MM.YYYY")}-{moment(ballot.endAt).format("DD.MM.YYYY")}</td>
        <td className='right aligned collapsing'>
          <div className='ui small buttons'>
            <a className='ui positive button' onClick={signals.ballotSelected.bind(this, {addr: ballot.addr})}>
              <i className='info icon'></i>
              Информация
            </a>
            {button}
          </div>
        </td>
      </tr>
    );
  }

  render() {
    const signals = this.props.signals.blockchain;
    return (
      <div>
        <h1 className="ui header">Здравствуйте!</h1>
        <table className='ui compact unstackable table'>
          <thead>
            <tr>
              <th>Название</th>
              <th>Эмитент</th>
              <th>Период голосования</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {_.map(this.props.ballots, this.renderItem.bind(this))}
          </tbody>
        </table>
      </div>

    );
  }
});
