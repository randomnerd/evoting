import React from 'react';
import {Companies} from '/both/collections';

export default React.createClass({
  mixins: [ReactMeteorData],
  delComp(event) {
    if (confirm('Remove currency?')) {
      Meteor
        .call('company_remove', $(event.currentTarget).attr('data-del'), function(error, result) {
          if (result) {
            this.setState({
              errorMessage: err.message
            });
          } else {
            FlowRouter.go('/admin/companies');
          }
        });
    }
  },
  getMeteorData() {
    return {
      companies: Companies.find({}, {
        sort: {
          name: 1
        }
      }).fetch()
    };
  },
  renderCompaniesList() {
    console.log(this.data.companies);
    return this.data.companies.map((comp) => {
      return (
          <tr key={comp._id}>
            <td>{comp.name}</td>
            <td>{comp.shortName}</td>
            <td className='right aligned collapsing'>
              <div className='ui tiny icon buttons'>
                <a className='ui positive button' href={'/admin/companies/edit/' + comp._id}>
                  <i className='write icon'></i>
                </a>
                <div className='ui negative button' onClick={this.delComp} data-del={comp._id}>
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
        <a className='ui blue labeled icon button' href='/admin/companies/new'>
          <i className='plus icon'/>
          New company
        </a>
        <table className='ui compact unstackable table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Short name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.renderCompaniesList()}
          </tbody>
        </table>
      </div>
    );
  }
});
