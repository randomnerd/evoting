import {
  Users,
  Companies
}
from '/both/collections';

Meteor.methods({

  'user_remove': (_id) => {
    if (!Meteor.userId())
      throw new Meteor.Error('Unauthorized');
      Users
        .remove(_id, function(err) {
          if (!err) {
            return true
          } else {
            return err
          }
        });
  },



  user_add: function(id) {
    Users.insert(id, function(err, id) {
      if (!err) {
        return false;
      } else {
        return err;
      }
    });
  },
  user_update: function(id, user) {
    Users.update(id, {
      $set: {username: user.username, company: user.company}
    }, function(err) {
      if (!err) {
        Roles.addUsersToRoles(id, [user.role])
        return false;
      } else {
        return err;
      }
    });
  },


  company_remove: function(id) {
    Companies.remove(id, function(err) {
      if (!err) {
        return false;
      } else {
        return err;
      }
    });
  },


  company_add: function(comp) {
    Companies.insert(comp, function(err, id) {
      if (!err) {
        return false;
      } else {
        return err;
      }
    });
  },
  company_update: function(id, comp) {
    Companies.update(id, {
      $set: comp
    }, function(err) {
      if (!err) {
        return false;
      } else {
        return err;
      }
    });
  },


  tradepair_remove: function(id) {
    TradePairs.remove(id, function(err) {
      if (!err) {
        return false;
      } else {
        return err;
      }
    });
  },

});
