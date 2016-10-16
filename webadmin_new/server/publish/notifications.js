import {Notifications} from '/both/collections';

Meteor.publish('notifications', function() {
  if (!this.userId) return false;
  return Notifications.find({userId: this.userId});
});
