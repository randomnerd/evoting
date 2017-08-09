import React from 'react';
import { connect } from 'cerebral-view-react';

export default connect({
  choice: 'blockchain.choice'
},
class BallotVoting extends React.Component {
  shouldComponentUpdate(nextProps) {
    return true;
    return nextProps.ballot !== this.props.ballot;
  }

  setVoted(event){
    //if (!Meteor.user()) { return; }
    const signals = this.props.signals.blockchain;
    let el = $(event.currentTarget);
    $('.vote').removeClass('positive');
    el.addClass('positive');
    //console.log(signals);
    signals.choiceSet({choice: el.attr('data-vote')});
  }

  renderOptionsItem(item, idx) {
    const ballot = this.props.ballot;
    const signals = this.props.signals.blockchain;
    return (
      <div className="item" key={idx}>
        <div className="right floated content">
          <div className="ui icon button vote" onClick={this.setVoted.bind(this)} data-vote={idx}>
            <i className="checkmark icon"></i>
          </div>
        </div>
        <i className="caret right icon"></i>
        <div className="content">
          {item}
        </div>
      </div>
    );
  }

  render() {
    const {ballot, choice} = this.props;
    const signals = this.props.signals.blockchain;


    return (
      <div>
        <h1 className="ui header">Голосование</h1>
        <div className='field'>
          <a className='ui blue labeled icon button' onClick={() => signals.showList()}>
            <i className='arrow left icon' />
            К списку собраний
          </a>
          <a className='ui blue labeled icon button' onClick={() => signals.voteDeSelected()}>
            <i className='list left icon' />
            Информация о собрании
          </a>
        </div>
        <div className="ui header">
          {ballot.question}
        </div>
        <div className="ui middle aligned divided list">
          {ballot.options.map(this.renderOptionsItem.bind(this))}
        </div>
        <div className='field'>
          <a className='ui green labeled icon button' onClick={signals.choiceSaved.bind(this, {ballot, choice})}>
            <i className='checkmark icon' />
            Проголосовать
          </a>
        </div>
      </div>
    )
  }
});
