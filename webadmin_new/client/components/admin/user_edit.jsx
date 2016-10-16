import React from 'react';
import Formsy from 'formsy-react';
import Semantic from '/client/components/semantic';
import {Companies} from '/both/collections';

export default React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {
      errorMessage: null,
      allowSubmit: false,
      published: ''
    };
  },

  newUser(event) {
    let {name, role, company} = this.refs.curr.getCurrentValues();

    Meteor.call('user_add',
    {name: name, role:role, company: company},
    function(error, result) {
      if (result) {
        this.setState({errorMessage: err.message});
      } else {
        FlowRouter.go('/admin/users');
      }
    });
  },
  saveUser(event) {
    let {username, role, company} = this.refs.user.getCurrentValues();
    console.log(this.props.user_id);
    Meteor.call('user_update', this.props.user_id, {username: username, role:role, company: company}, function(err, result) {
      if (result) {
        console.log(result);
      } else {
        console.log(err);
        FlowRouter.go('/admin/users');
      }
    });
  },
  getMeteorData() {
    return {
      user: Meteor.users.findOne({_id: this.props.user_id}),
      companies: Companies.find({}, {sort: {name: 1} }).fetch()
    };
  },
  userVal(what) {
    return this.data.user ? this.data.user[what]||'' : '';
  },
  userComps() {
    let companies = [];
    this.data.companies.map((comp) => {
      companies.push({_id: comp._id, description: comp.name, title: comp.shortName});
    })

    return companies;
  },
  userTypes() {
    return [
      {_id: "organizer", title: "Организатор Собрания", description: "Организатор Собрания"},
      {_id: "owner", title: "Владелец ЦБ", description: "Владелец ЦБ"},
    ]
  },

  allowSubmit() { this.setState({allowSubmit: true}); },
  disallowSubmit() { this.setState({allowSubmit: false}); },
  render() {
    //this.published = this.currentVal('published') ? 'checked' : false;
    return (
      <div>

        <Formsy.Form className='ui form'
        onValidSubmit={this.newCurr} onValid={this.allowSubmit} onInvalid={this.disallowSubmit}
        ref='user'>
          <div className='field'>
            <a className='ui blue labeled icon button' href='/admin/users'>
              <i className='arrow left icon' />
              Back
            </a>
          </div>
          <Semantic.Input name='username'
          label='Full name' validations='minLength:3' placeholder='Enter username'
          required value={this.userVal('username')} />
          <Semantic.Select name='company' label='Company' placeholder='Select company'
          required content={this.userComps()} />
          <Semantic.Select name='role' label='User type' placeholder='Select user type'
          required content={this.userTypes()} />
          <div className='two fields'>


          <div className='field'>

            <a className='ui positive labeled right aligned icon button'
              onClick={this.props.user_id ? this.saveUser : this.newUser}>
              <i className='checkmark icon' />
              Save
            </a>

          </div>

          </div>
        </Formsy.Form>
      </div>
    );
  }
});
