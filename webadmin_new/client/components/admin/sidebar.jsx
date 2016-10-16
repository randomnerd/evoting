import React from 'react';

export default React.createClass({
  render() {
    return (
      <div className='ui fluid vertical menu'>
        <a href='/admin/users' className='item'>Users</a>
        <a href='/admin/companies' className='item'>Companies</a>
      </div>
    );
  }
});
