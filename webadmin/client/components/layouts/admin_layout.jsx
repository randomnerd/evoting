import React from 'react';
import TopMenu from '/client/components/admin/top_menu';
import LoginModal from '/client/components/login_modal';
import SignUpModal from '/client/components/sign_up_modal';
import AdminOnly from '/client/components/admin/admin_only';
import AdminMenu from '/client/components/admin/sidebar';

export default React.createClass({
  getInitialState() {
    return {
      showLoginModal: false,
      showSignUpModal: false,
    };
  },
  componentDidMount() {
    Dispatcher.register((e) => {
      //console.log('new dispatcher event', payload);
      switch (e.actionType) {
        case 'SHOW_LOGIN_MODAL':
          this.setState({showLoginModal: true});
          break;

        case 'HIDE_LOGIN_MODAL':
          this.setState({showLoginModal: false});
          break;

        case 'SHOW_SIGN_UP_MODAL':
          this.setState({showSignUpModal: true});
          break;

        case 'HIDE_SIGN_UP_MODAL':
          this.setState({showSignUpModal: false});
          break;


      }
    });
  },
  render() {
    return (
      <AdminOnly redirect='/'>
        <div>
          <TopMenu />
          <div className='ui main container'>
            <div className='ui grid'>
              <div className='four wide column'>
                <AdminMenu />
              </div>
              <div className='twelve wide column'>
                {this.props.content}
              </div>
            </div>
          </div>
          <LoginModal show={this.state.showLoginModal} />
          <SignUpModal show={this.state.showSignUpModal} />
        </div>

      </AdminOnly>
    );
  }
});
