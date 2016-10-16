import React from 'react';
import AdminOnly from '/client/components/admin/admin_only';
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
      { href: '/organizer/meetings', label: 'Собрания', extraCls: '' },
      { href: '', label: 'Выйти из системы', extraCls: '', onclick: this.logOut }
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
  logOut() {

    Meteor.logout();
    FlowRouter.go('/');
  },

  renderLoginButtons() {
    return (
      <div className="right menu">
        <a className="item" onClick={this.showLoginModal}>Войти в систему</a>
        <a className="item" onClick={this.showSignUpModal}>Зарегистрироваться</a>
      </div>
    );
  },
  render() {
    return (
      <div className="ui top fixed large menu">
        <div className="ui fluid container">
          <a className="item " href="/"><i className="circle large red icon"></i>{this.data.user && this.data.user.username}</a>
          { this.renderMenuItems() }


            { this.data.user ?
              <div className="right menu">
                {this.props.pair ? <a className={"icon item" + (this.state.drag ? " active" : "")} onClick={this.dragToggle} title="View control">
                  <i className="block layout icon"></i>
                </a> : null}
                <AdminOnly>
                  <a className="item" href="/admin/">Администратор</a>
                </AdminOnly>

              </div>
              : this.renderLoginButtons()
            }


        </div>
      </div>
    );
  }
});
