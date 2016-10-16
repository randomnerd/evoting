import React from 'react';
import {Companies, Meetings, Votings} from '/both/collections';

export default React.createClass({
  mixins: [ReactMeteorData],

  getStatusName(status){
    let st={
      'started':"Идет ОС",
      'finished':"Завершено"
    };
    return st[status]||"Недоступно";
  },
  voteButtons(meet){
    return(
      <div className='ui small buttons'>
        <a className='ui positive button' href={'/organizer/meetings/view/' + meet._id}>
          <i className='info icon'></i>
          Информация
        </a>
        <a className='ui blue button' href={'/organizer/meetings/vote/' + meet._id}>
          <i className='checkmark box icon'></i>
          Голосовать
        </a>
      </div>
    )
  },
  finishedButtons(meet){
    return(
      <div className='ui small icon buttons'>
        <a className='ui button' href={'/organizer/meetings/view/' + meet._id}>
          <i className='info icon'></i>
          Информация
        </a>
      </div>
    )
  },
  getCompanyName(id){
    let comp = _.findWhere(this.data.companies, {
      _id: id
    });
    return comp
      ? comp.shortName
      : '';
  },
  getMeetingName(id){
    let meet = _.findWhere(this.data.meetings, {
      _id: id
    });
    return meet
      ? meet.name
      : '';
  },
  getMeteorData() {
    return {
      votings: Votings.find().fetch(),
      companies: Companies.find({}, { sort: { name: 1 } }).fetch(),
      meetings: Meetings.find({owner: Meteor.userId()}, { sort: { startDate: 1 } }).fetch()
    };
  },
  renderMeetingsList() {
    console.log(this.data.votings);
    return this.data.votings.map((vote) => {
      return (
          <tr key={vote._id}>
            <td>{vote.voter_name}</td>
            <td>{vote.volume}</td>
            <td>{vote.company_name}</td>
            <td>{vote.meeting_name}</td>
            <td>{vote.question}</td>
            <td>{vote.choice_num}. {vote.choice_text}</td>
            <td className='right aligned collapsing'>
              <div className='ui small icon buttons'>
                <a className='ui button' href={'/organizer/votings/view/' + vote._id}>
                  <i className='info icon'></i>
                </a>
              </div>
            </td>
          </tr>
        );
    });
  },
  render() {
    return (
      <div>
        <div className='field'>
          <a className='ui blue labeled icon button' href='/organizer/meetings'>
            <i className='arrow left icon' />
            К списку собраний
          </a>
          <a className='ui blue labeled icon button' href={'/organizer/meetings/view/' + this.props.meet_id}>
            <i className='list left icon' />
            Информация о собрании
          </a>
        </div>
        <table className='ui compact unstackable table'>
          <thead>
            <tr>
              <th>Участник</th>
              <th>Пакет акций</th>
              <th>Эмитент</th>
              <th>Собрание</th>
              <th>Вопрос</th>
              <th>Ответ</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {this.renderMeetingsList()}
          </tbody>
        </table>
      </div>
    );
  }
});
