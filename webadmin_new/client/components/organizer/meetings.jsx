import React from 'react';
import {Companies, Meetings, Users} from '/both/collections';

export default React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {
      meet_id: false
    };
  },
  delMeet(event) {
    if (confirm('Remove meeting?')) {
      Meteor
        .call('meeting_remove', $(event.currentTarget).attr('data-del'), function(error, result) {
          if (result) {
            this.setState({
              errorMessage: err.message
            });
          } else {
            //FlowRouter.go('/admin/companies');
          }
        });
    }
  },
  startMeet(event) {
    if (confirm('Start meeting?')) {
      let id = $(event.currentTarget).attr('data-del');
      Meteor.call('startMeet', id);
    }
  },
  getStatusName(status){
    let st={
      'draft':"Черновик",
      'started':"Идет ОС",
      'finished':"Завершено"
    };
    return st[status]||"Недоступно";
  },
  draftButtons(meet){
    return(
      <div className='ui tiny icon buttons'>
        <a className='ui positive button' href={'/organizer/meetings/edit/' + meet._id}>
          <i className='write icon'></i>
        </a>
        <a className='ui blue button' onClick={this.startMeet} data-del={meet._id}>
          <i className='play icon'></i>
        </a>
        <div className='ui negative button' onClick={this.delMeet} data-del={meet._id}>
          <i className='remove icon'></i>
        </div>
      </div>
    )
  },
  startedButtons(meet){
    return(
      <div className='ui tiny icon buttons'>
        <a className='ui blue button' href={'/organizer/meetings/view/' + meet._id}>
          <i className='sidebar icon'></i>
          Инфо
        </a>
      </div>
    )
  },
  finishedButtons(meet){
    return(
      <div className='ui tiny icon buttons'>
        <a className='ui blue button' href={'/organizer/meetings/view/' + meet._id}>
          <i className='sidebar icon'></i>
          Итоги
        </a>
      </div>
    )
  },
  getMeet(id){
    let meet = _.findWhere(this.data.meetings, {
      _id: id
    });
    return meet;
  },
  userComp(id){
    let comp = _.findWhere(this.data.companies, {
      _id: id
    });
    return comp
      ? comp.shortName
      : '';
  },
  getMeteorData() {
    return {
      reester: Users.find({meeting: this.state.meet_id}, { sort: { name: 1 } }).fetch(),
      companies: Companies.find({}, { sort: { name: 1 } }).fetch(),
      meetings: Meetings.find({owner: Meteor.userId()}, { sort: { startDate: 1 } }).fetch()
    };
  },
  renderMeetingsList() {
    return this.data.meetings.map((meet) => {
      return (
          <tr key={meet._id}>
            <td>{meet.name}</td>
            <td>{this.getStatusName(meet.status)}</td>
            <td>{meet.company}</td>
            <td>{meet.startDate}-{meet.stopDate}</td>
            <td className='right aligned collapsing'>
              {meet.status=="draft"?this.draftButtons(meet):(meet.status=="started"?this.startedButtons(meet):this.finishedButtons(meet))}
            </td>
          </tr>
        );
    });
  },
  render() {
    return (
      <div>
        <a className='ui blue labeled icon button' href='/organizer/meetings/new'>
          <i className='plus icon'/>
          Создать новое собрание
        </a>
        <table className='ui compact unstackable table'>
          <thead>
            <tr>
              <th>Название</th>
              <th>Статус</th>
              <th>Эмитент</th>
              <th>Период голосования</th>
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
