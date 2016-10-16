import {Meetings} from '/both/collections';

Meteor.publish('meetings', function() {
  if (!this.userId) return false;
  return Meetings.find();
});
