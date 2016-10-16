import React from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';

@Cerebral({
  secretKey: ['account', 'secretKey']
})
export default class BallotView extends React.Component {
  importKey() {
    this.props.signals.blockchain.loadKey({secretKey: this.refs.secretKey.value});
  }

  render() {
    const {secretKey, signals: {blockchain: signals}} = this.props;
    return (
      <div className="ui form">
        <h1 className="ui header">Здравствуйте!</h1>
        <div className="field">
          <label>Приватный ключ</label>
          <input placeholder="Введите приватный ключ" type="text" type="text" ref="secretKey" value={secretKey} />
        </div>
        <button onClick={this.importKey.bind(this)} className="ui primary button">Войти</button>
      </div>
    )
  }
}
