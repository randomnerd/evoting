Meteor.subs = new SubsManager({ cacheLimit: 20 });

Tracker.autorun(() => {
  //Meteor.subs.subscribe('chat');

  let user = Meteor.user();
  if (user) {
    Meteor.subs.subscribe('votings');
    Meteor.subs.subscribe('meetings');
    Meteor.subs.subscribe('reester');
    Meteor.subs.subscribe('companies');
    //Meteor.subs.subscribe('notifications');
    if (user.isAdmin()) {
      Meteor.subs.subscribe('users');

    }
  }
});
