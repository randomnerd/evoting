import React from 'react';
import Formsy from 'formsy-react';
import {Companies, Meetings} from '/both/collections';
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

  getMeteorData() {
    return {
      companies: Companies.findOne({_id:Meteor.user().company})
      //reester: Users.findOne({_id: Meteor.userId()})
    };
  },
  compName(){

  },
  render() {
    //this.published = this.currentVal('published') ? 'checked' : false;
    console.log(this.data.reester);
    return (
      <div>
        <div className="ui segment">
          Здравствуйте, {Meteor.user().username}
        </div>
        <div className='field'>
          <a className='ui blue labeled icon button' href='/organizer/meetings'>
            <i className='download icon' />
            Скачать программу
          </a>
        </div>
      </div>
    );
  }
});
