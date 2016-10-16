import {Votings} from '/both/collections';

Meteor.publish('votings', function() {
  if (!this.userId) return false;
  return Votings.find();
});
