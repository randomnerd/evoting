import {Users} from '/both/collections';

Meteor.publish('users', function() {
  if (!this.userId) return false;
  return Users.find();
});
