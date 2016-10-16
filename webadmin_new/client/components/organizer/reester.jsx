import React from 'react';
import {Companies, Meetings, Users} from '/both/collections';

export default React.createClass({
  mixins: [ReactMeteorData],
  delOwner(event) {
    if (confirm('Remove meeting?')) {
      Meteor
        .call('owner_remove', $(event.currentTarget).attr('data-del'), function(error, result) {
          if (result) {

          } else {
            //FlowRouter.go('/admin/companies');
          }
        });
    }
  },

  getMeteorData() {
    return {
      reester: Users.find({meeting: this.props.meet_id}, { sort: { name: 1 } }).fetch()
    };
  },
  renderReesterList() {
    return this.data.reester.map((owner) => {
      return (
          <tr key={owner._id}>
            <td>{owner.username}</td>
            <td>{owner.shares}</td>
            <td>{owner.profile.key.secret}</td>
            <td className='right aligned collapsing'>
            <div className='ui tiny icon buttons'>
              <div className='ui negative button' onClick={this.delOwner} data-del={owner._id}>
                <i className='remove icon'></i>
              </div>
            </div>
            </td>
          </tr>
        );
    });
  },
  render() {
    return (
      <div>
        <a className='ui blue labeled icon button' href={'/organizer/meetings/view/' + this.props.meet_id}>
          <i className='arrow left icon'/>
          Назад
        </a>
        <table className='ui compact unstackable table'>
          <thead>
            <tr>
              <th>Владелец ЦБ</th>
              <th>Объем ЦБ</th>
              <th>Ключ</th>
              <th>Удалить</th>
            </tr>
          </thead>
          <tbody>
            {this.renderReesterList()}
          </tbody>
        </table>
      </div>
    );
  }
});
