Accounts.onLogin(function(session) {
  if (Roles.getUsersInRole('admin').count() > 0) return;
  Roles.addUsersToRoles(session.user._id, ['admin']);
});
