import {Users} from '/both/collections';

Meteor.publish('reester', function() {
  if (!this.userId) return false;
  return Users.find();
});
