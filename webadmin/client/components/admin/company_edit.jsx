import React from 'react';
import Formsy from 'formsy-react';
import {Companies} from '/both/collections';
import Semantic from '/client/components/semantic';

export default React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {
      errorMessage: null,
      allowSubmit: false,
      published: ''
    };
  },

  newComp(event) {
    let {name, shortName} = this.refs.comp.getCurrentValues();

    Meteor.call('company_add',
    {name: name, shortName: shortName},
    function(error, result) {
      if (result) {
        console.log(result);
      } else {
        console.log(error);
        FlowRouter.go('/admin/companies');
      }
    });
  },
  saveComp(event) {
    let currVals = this.refs.comp.getCurrentValues();
    Meteor.call('company_update', this.data.company._id, currVals, function(error, result) {
      if (result) {
        this.setState({errorMessage: err.message});
      } else {
        FlowRouter.go('/admin/companies');
      }
    });
  },
  getMeteorData() {
    return {
      company: Companies.findOne({_id: this.props.comp_id})
    };
  },
  currentVal(what) {
    return this.data.company ? this.data.company[what] : '';
  },
  allowSubmit() { this.setState({allowSubmit: true}); },
  disallowSubmit() { this.setState({allowSubmit: false}); },
  render() {
    this.published = this.currentVal('published') ? 'checked' : false;
    return (
      <div>

        <Formsy.Form key={this.props.k} className='ui form'
        onValidSubmit={this.newCurr} onValid={this.allowSubmit} onInvalid={this.disallowSubmit}
        ref='comp'>
          <div className='field'>
            <a className='ui blue labeled icon button' href='/admin/companies'>
              <i className='arrow left icon' />
              Back
            </a>
          </div>
          <Semantic.Input name='name'
          label='Full name' validations='minLength:3' placeholder='Enter name of currency'
          required value={this.currentVal('name')} />
          <Semantic.Input name='shortName'
          label='Short name' validations='minLength:3' placeholder='Enter short name of currency'
          required value={this.currentVal('shortName')} />
          <div className='two fields'>
            <div className='field'>

              <a className='ui positive labeled right aligned icon button'
                onClick={this.props.comp_id ? this.saveComp : this.newComp}>
                <i className='checkmark icon' />
                Save company
              </a>

            </div>

          </div>
        </Formsy.Form>
      </div>
    );
  }
});
