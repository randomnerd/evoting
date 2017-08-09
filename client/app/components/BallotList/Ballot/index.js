import React from 'react';
import { connect } from 'cerebral-view-react';
import moment from 'moment';

export default connect({
  choice: 'blockchain.choice'
},
class BallotView extends React.Component {
  shouldComponentUpdate(nextProps) {
    return true;
    return nextProps.ballot !== this.props.ballot;
  }

  renderOptionsList() {
    const ballot = this.props.ballot;
    return (
      <div>
        {ballot.options.map(this.anwersVal.bind(this))}
      </div>
    );
  }

  anwersVal(item, idx) {
    const ballot = this.props.ballot;
    const signals = this.props.signals.blockchain;
    let reg = "";
    return (

      <div className="item" key={idx}>
        <i className="right triangle icon"></i>
        <div className="content">{item}</div>
      </div>

    );

    //return answers?($.isArray(answers)?answers.join('<br />'):answers):'';
  }

  renderOptionsItem(item, idx) {
    const ballot = this.props.ballot;
    const signals = this.props.signals.blockchain;
    return (
      <label key={idx}>
        <input type="radio" name="choice" value={idx} checked={this.props.choice == idx} onChange={signals.choiceSet.bind(this, {choice: idx})}/>
        {item}
      </label>
    );
  }

  render() {
    const {ballot, choice} = this.props;
    const signals = this.props.signals.blockchain;
    return (

      <div>
        <h1 className="ui header">Информация о голосовании</h1>
        <div className='field'>
          <a className='ui blue labeled icon button'  onClick={signals.showList}>
            <i className='arrow left icon' />
            Назад
          </a>
        </div>
        <table className="ui very basic celled table">
          <tbody>
            <tr>
              <td className="collapsed">
                <h4 className="ui image header">
                  <i className="caret right icon"></i>
                  <div className="content">
                    Название
                    <div className="sub header">Тема собрания
                  </div>
                </div>
              </h4>
              </td>
              <td>
                {ballot.name}
              </td>
            </tr>
            <tr>
              <td className="collapsed">
                <h4 className="ui image header">
                  <i className="caret right icon"></i>
                  <div className="content">
                    Время
                    <div className="sub header">Период проведения собрания
                  </div>
                </div>
              </h4></td>
              <td>
                {moment(ballot.startAt).format("DD.MM.YYYY")}-{moment(ballot.endAt).format("DD.MM.YYYY")}
              </td>
            </tr>

            <tr>
              <td className="collapsed">
                <h4 className="ui image header">
                  <i className="caret right icon"></i>
                  <div className="content">
                    Описание
                    <div className="sub header">Основные тезисы собрания
                  </div>
                </div>
              </h4></td>
              <td>
                {ballot.description}
              </td>
            </tr>
            <tr>
              <td className="collapsed">
                <h4 className="ui image header">
                  <i className="caret right icon"></i>
                  <div className="content">
                    Вопрос
                    <div className="sub header">для голосования
                  </div>
                </div>
              </h4></td>
              <td>
                {ballot.question}
              </td>
            </tr>
            <tr>
              <td className="collapsed">
                <h4 className="ui image header">
                  <i className="caret right icon"></i>
                  <div className="content">
                    Ответы
                    <div className="sub header">Варианты ответов
                  </div>
                </div>
              </h4></td>
              <td>
                <div className="ui list">
                  {ballot.options.map(this.anwersVal.bind(this))}
                </div>
              </td>
            </tr>
            <tr>
              <td className="collapsed">
                <h4 className="ui image header">
                  <i className="caret right icon"></i>
                  <div className="content">
                    Статус
                    <div className="sub header">В каком статусе собрание
                  </div>
                </div>
              </h4></td>
              <td>
                {ballot.status}
              </td>
            </tr>

          </tbody>
        </table>
        <div className='field'>

          {ballot.status=="finished"?
            <div>
              <a className='ui blue button' href={'/organizer/meetings/results/' + this.props.meet_id}>
                <i className='list icon'></i>
                Посмотреть итоги
              </a>
              <button onClick={signals.choiceSaved.bind(this, {ballot, choice})}>save</button>
            </div>
            :
            <div>
              <a className='ui blue labeled icon button' onClick={signals.voteSelected}>
                <i className='checkmark box icon' />
                Голосовать
              </a>
            </div>
         }
        </div>
      </div>
    )
  }
});
