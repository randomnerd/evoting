import React from 'react';
//import UserTopMenu from 'components/user_top_menu';

export default React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      user: Meteor.user()
    }
  },
  getInitialState() {
    return {
      drag:false
    };
  },
  getMenuItems() {
    return [
      { href: '/', label: 'Home', extraCls: '' },
      { href: '', label: 'Logout', extraCls: '', onclick: this.logOut }
    ];
  },
  renderMenuItems() {
    return this.getMenuItems().map((item) => {
      return <a className={"item " + item.extraCls} key={item.label} href={item.href} onClick={item.onclick}>{item.label}</a>;
    });
  },
  showLoginModal() {
    Dispatcher.dispatch({ actionType: 'SHOW_LOGIN_MODAL' });
  },
  showSignUpModal() {
    Dispatcher.dispatch({ actionType: 'SHOW_SIGN_UP_MODAL' });
  },
  chatToggle() {
    Dispatcher.dispatch({ actionType: 'SHOW_CHAT' });
  },
  infoToggle(){
      Dispatcher.dispatch({ actionType: 'SHOW_PANEL' } );
  },
  dragToggle(){
      Dispatcher.dispatch({ actionType: 'DRAG' } );
      this.setState({drag: !this.state.drag});
  },
  renderLoginButtons() {
    return (
      <div className="right menu">
        <a className="item" onClick={this.showLoginModal}>Log in</a>
        <a className="item" onClick={this.showSignUpModal}>Sign up</a>
      </div>
    );
  },
  logOut() {
    Meteor.logout();
    FlowRouter.go('/');
  },
  render() {
    return (
      <div className="ui top fixed large menu">
        <div className="ui fluid container">
          <a className="item " href="/"><i className="circle large red icon"></i>Голосовалка</a>
          { this.renderMenuItems() }
          <a className="icon item double" onClick={this.infoToggle}>
            <p><i className="dropdown large icon"></i></p>
          </a>

            { this.data.user ?
              <div className="right menu">
                {this.props.pair ? <a className={"icon item" + (this.state.drag ? " active" : "")} onClick={this.dragToggle} title="View control">
                  <i className="block layout icon"></i>
                </a> : null}
              </div>
              : this.renderLoginButtons()
            }


        </div>
      </div>
    );
  }
});
