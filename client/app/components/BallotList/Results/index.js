import React from 'react';
import { connect } from 'cerebral-view-react';
import moment from 'moment';

export default connect({
  choice: 'blockchain.choice'
},
class BallotResults extends React.Component {
  componentDidMount() {
    const signals = this.props.signals.blockchain;
    signals.loadRegistry();
  }

  shouldComponentUpdate(nextProps) {
    return true;
    return nextProps.ballot !== this.props.ballot;
  }

  renderOptionsList() {
    const ballot = this.props.ballot;
    return (
      <div>
        {ballot.options.map(this.anwersVal.bind(this))}
      </div>
    );
  }

  anwersVal(item, idx) {
    const ballot = this.props.ballot;
    const signals = this.props.signals.blockchain;
    let reg = "";
    return (

      <div className="item" key={idx}>
        <i className="right triangle icon"></i>
        <div className="content">{item}</div>
      </div>

    );
  }

  renderItem(voter) {
    const {ballot, choice} = this.props;
    const signals = this.props.signals.blockchain;
    let button = null;

    return (
      <tr key={voter.address}>
        <td>{voter.address}</td>
        <td>{voter.fullName}</td>
        <td>{voter.weight}</td>
        <td>{voter.votedAt ? moment(voter.votedAt).format("DD.MM.YYYY") : ''}</td>
        <td className='right aligned collapsing'>
          {ballot.options[voter.choice]}
        </td>
      </tr>
    );
  }

  render() {
    const {ballot, choice} = this.props;
    const signals = this.props.signals.blockchain;
    return (

      <div>
        <h1 className="ui header">Информация о голосовании</h1>
        <div className='field'>
          <a className='ui blue labeled icon button' onClick={signals.showList}>
            <i className='arrow left icon' />
            К списку собраний
          </a>
          <a className='ui blue labeled icon button' onClick={signals.voteDeSelected}>
            <i className='list left icon' />
            Информация о собрании
          </a>
        </div>
        <table className='ui compact unstackable table'>
          <thead>
            <tr>
              <th>Адрес</th>
              <th>Имя</th>
              <th>Объем ЦБ</th>
              <th>Время подачи голоса</th>
              <th>Выбор</th>
            </tr>
          </thead>
          <tbody>
            {_.map(ballot.registry, this.renderItem.bind(this))}
          </tbody>
        </table>
      </div>
    )
  }
});
