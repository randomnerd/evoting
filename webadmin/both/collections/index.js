/* global Mongo, Meteor */
export const Users = Meteor.users; // username, roles: [organizer|owner|admin], company (_id from Companies)

export const Companies = new Mongo.Collection('companies'); // name, shortNmae

export const Meetings = Meteor.Meetings = new Mongo.Collection('meetings');
export const Votings = Meteor.Votings = new Mongo.Collection('votings');
//export const Reester = new Mongo.Collection('reester');
