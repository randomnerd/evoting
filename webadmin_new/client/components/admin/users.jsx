import React from 'react';
import Semantic from '/client/components/semantic';
import {Companies} from '/both/collections';

export default React.createClass({
  mixins: [ReactMeteorData],
  delUser(event) {
    if (confirm('Remove user?')) {
      Meteor
        .call('user_remove', $(event.currentTarget).attr('data-del'), function(error, result) {
          if (result) {
            //console.log(result);
          } else {

            //console.log(error.message);
            //console.log(error);
            FlowRouter.go('/admin/users');
          }
        });
    }
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
      users: Meteor.users.find().fetch(),
      companies: Companies.find({}, {sort: {name: 1} }).fetch()
    };
  },
  renderUserList() {
    return this.data.users.map((user) => {
      return (
          <tr key={user._id}>
            <td>{user.username?(user.username):(user.emails[0].address)}</td>
            <td>{this.userComp(user.company)}</td>
            <td>{user.roles?($.isArray(user.roles)?user.roles.join(','):user.roles):''}</td>
            <td className='right aligned collapsing'>
              <div className='ui tiny icon buttons'>
                <a className='ui positive button' href={'/admin/user/edit/' + user._id}>
                  <i className='write icon'></i>
                </a>
                <div className='ui negative button' onClick={this.delUser} data-del={user._id}>
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
        <table className='ui compact unstackable table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Roles</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.renderUserList()}
          </tbody>
        </table>
      </div>
    );
  }
});
