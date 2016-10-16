import { Random } from 'meteor/random';
import {Notifications, Chat, Meetings, Users, Votings} from '/both/collections';

Meteor.methods({
  generate: (id, amount = 10)=>{
    for(let i=0; i<amount; i++){
      var accountObject = keyStore.newAccount();
      let username = 'user' + Random.hexString(8);
      let email = username + '@company.name';
      let user = {
        meeting:  id,
        roles:    ['owner'],
        shares:   Math.floor(1 + Math.random() * 1000),
        emails:   [ { address: email, verified: true } ],
        profile:  {
          key: {
            address: accountObject.address,
            secret: accountObject.secretKey.toString('hex')
          }
        },
        username: username
      };
      Users.insert(user, (err, uid) => {
        Accounts.setPassword(uid, '123qwe');
      });
    }

    return amount;
  },

  'owner_remove': (_id) => {
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

  'notifications/del': (_id) => {
    if (!Meteor.userId())
      throw new Meteor.Error('Unauthorized');
    Notifications.update({
      _id: _id,
      userId: Meteor.userId()
    }, {
      $set: {
        ack: true
      }
    }, (err) => {
      if (err) {
        return err
      } else {
        return false
      }
    })
  },
  'notifications/del_realy': (_id) => {
    if (!Meteor.userId())
      throw new Meteor.Error('Unauthorized');
    Notifications.remove({
      _id: _id
    }, (err) => {
      if (err) {
        return err
      } else {
        return false
      }
    })
  },
  'notifications/clear_all': (_id) => {
    if (!Meteor.userId())
      throw new Meteor.Error('Unauthorized');
    Notifications.remove({
      userId: Meteor.userId()
    }, (err) => {
      if (err) {
        return err
      } else {
        return false
      }
    })
  },
  //
  'notifications/add': () =>{
    //Notifications.remove({},()=>{
      var arr=[
        {userId: Meteor.userId(), type:'warning',title:'Password changed!', message:'A dropdown can include a search prompt inside its menu',ack: false, createdAt: new Date()},
        {userId: Meteor.userId(), type:'accept',title:'Your password changed!', message: 'A dropdown menu can appear to be floating below an element.',ack: false, createdAt: new Date()},
        {userId: Meteor.userId(), type:'info',title:'You won an one million dollars!', message: 'menu can contain dividers to separate related content.',ack: false, createdAt: new Date()},
        {userId: Meteor.userId(), type:'chat',title:'Your password changed!', message: 'A dropdown menu can appear to be floating below an element.',ack: false, createdAt: new Date()},
        {userId: Meteor.userId(), type:'error',title:'You won an one million dollars!', message: 'menu can contain dividers to separate related content.',ack: false, createdAt: new Date()},
      ]
      if (!Meteor.userId()) throw new Meteor.Error('Unauthorized');
      for(var i=0; i<5; i++){
        Notifications.insert(
          arr[i],
          (err)=>{
            if(err){
              //return err
            }else {
              //return false
            }
          }
        )
      }
    //})
  },
  //

  'meeting_add': function(vals) {
    if (!Meteor.userId())
      throw new Meteor.Error('Unauthorized');
    vals.owner = Meteor.userId();
    vals.status = "draft";
    vals.company = Meteor.user().username;
    return Meetings
      .insert(vals, function(err, id) {
        if (!err) {
          return true
        } else {
          return err
        }
      });
  },
  "meeting_update": function(id, vals) {
    if (!Meteor.userId())
      throw new Meteor.Error('Unauthorized');
    Meetings
      .update(id, {
        $set: vals
      }, function(err) {
        if (!err) {
          return false
        } else {
          return err
        }
      });
  },

  "my_choice": function(vals) {
    if (!Meteor.userId())
      throw new Meteor.Error('Unauthorized');
    Meetings
      .update(vals.meeting, {
        $set: {
          my_choice: vals.choice,

        }
      }, function(err) {
        if (!err) {
          return false
        } else {
          return err
        }
      });
  },

  "vote": function(vals) {
    if (!Meteor.userId())
      throw new Meteor.Error('Unauthorized');
      let $ok=true;
      Meetings.update(vals.meeting, {
        $set: {
          my_choice: vals.choice.num,
          status: 'finished'
        }
      }, function(err) {
        if (!err) {
          let user = Meteor.user();

          let vote = {
            voter_id: Meteor.userId(),
            voter_name: user.username,
            volume: user.shares||0,
            company_id: vals.meeting.company,
            company_name: vals.company,
            meeting_id: vals.meeting._id,
            meeting_name: vals.meeting.name,
            question: vals.meeting.question,
            choice_num: vals.choice.num,
            choice_text: vals.choice.text
          };
          console.log(vote);
          Votings.insert(vote, function(err) {
            if (!err) {
              return true;
            } else {
              return false;
            }
          });
        } else {
          $ok=false;
        }
      });



      //return $ok;
  },

  'meeting_remove': function(id) {
    if (!Meteor.userId())
      throw new Meteor.Error('Unauthorized');
    Meetings
      .remove(id, function(err) {
        if (!err) {
          return false
        } else {
          return err
        }
      });
  },

  'meeting_start': function(id) {
    if (!Meteor.userId())
      throw new Meteor.Error('Unauthorized');
    Meetings
      .update(id, {
        $set: {status: "started"}
      }, function(err) {
        if (!err) {
          return false
        } else {
          return err
        }
      });
  },

  'chat/add': function(message) {
    //Chat.remove({})
    if (!Meteor.userId())
      throw new Meteor.Error('Unauthorized');
    message.userId = Meteor.userId()
    message.userName = Meteor.user()
      .username
    message.createdAt = new Date()
    Chat
      .insert(message, function(err, id) {
        if (!err) {
          return false
        } else {
          return err
        }
      });
  },
  "chat/update": function(id, address) {
    if (!Meteor.userId())
      throw new Meteor.Error('Unauthorized');
    Chat
      .update(id, {
        $set: address
      }, function(err) {
        if (!err) {
          return false
        } else {
          return err
        }
      });
  },

  'chat/remove': function(id) {
    if (!Meteor.userId())
      throw new Meteor.Error('Unauthorized');
    Chat
      .remove(id, function(err) {
        if (!err) {
          return false
        } else {
          return err
        }
      });
  },

  "chatname/update": function(name) {
    if (!Meteor.userId())
      throw new Meteor.Error('Unauthorized');
    Meteor.users
      .update(Meteor.userId(), {
        $set: {
          username: name
        }
      }, function(err) {
        if (!err) {
          return false
        } else {
          return err
        }
      });
  },
  "userblocs/update": function(sets) {
    if (!Meteor.userId())
      throw new Meteor.Error('Unauthorized');
    Meteor.users
      .update(Meteor.userId(), {
        $set: {
          profile: {blocs :sets}
        }
      }, function(err) {
        if (!err) {
          return false
        } else {
          return err
        }
      });
  },
  withdraw: function(params) {
    if (!Meteor.userId())
      throw new Meteor.Error('Unauthorized');
    let curr = Currencies.findOne(params.currId);
    Withdrawals.insert({
      userId: Meteor.userId(),
      currId: params.currId,
      address: params.address,
      fee: parseFloat(curr.withdrawalFee) * Math.pow(10, 8),
      amount: parseFloat(params.amount) * Math.pow(10, 8),
      state: 'initial',
      createdAt: new Date()
    });
  }

});
