import {Companies} from '/both/collections';

Meteor.publish('companies', function() {
  if (!this.userId) return false;
  return Companies.find();
});
