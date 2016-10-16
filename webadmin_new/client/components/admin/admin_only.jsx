import React from 'react';

export default React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      admin: Meteor.user() && Meteor.user().isAdmin(),
      authInProgress: Meteor.loggingIn()
    };
  },
  render() {
    if (!this.data.admin && !this.data.authInProgress && this.props.redirect) {
      FlowRouter.go(this.props.redirect);
    }
    return this.data.admin ? this.props.children : null;
  }
});
