import React from 'react';
import Formsy from 'formsy-react';
import {Companies, Meetings} from '/both/collections';
import Semantic from '/client/components/semantic';

export default React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {
      errorMessage: null,
      allowSubmit: false,
      published: ''
    };
  },
  generate(){
    if (confirm('Start generating?')) {
      let $this=this;
      Meteor
        .call('generate', $this.props.meet_id, function(error, result) {
          if (result) {
            //console.log(result);
          } else {
            //console.log($this.data.reester);
          }
        });
    }
  },
  getMeteorData() {
    return {
      //companies: Companies.find({}, { sort: { name: 1 } }).fetch(),
      //reester: Users.find({}, { sort: { name: 1 } }).fetch(),
      meeting: Meetings.findOne({_id: this.props.meet_id})
    };
  },
  currentVal(what) {
    return this.data.meeting ? this.data.meeting[what] : '';
  },
  anwersVal() {
    let answers=this.currentVal('answers');
    let reg = "";
    if(answers&&$.isArray(answers)){
      return answers.map((answer, idx) => {
        return (

          <div className="item" key={idx}>
            <i className="right triangle icon"></i>
            <div className="content">{answer}</div>
          </div>

          );
      });
    }else{
      return "";
    }
    //return answers?($.isArray(answers)?answers.join('<br />'):answers):'';
  },
  allowSubmit() { this.setState({allowSubmit: true}); },
  disallowSubmit() { this.setState({allowSubmit: false}); },
  render() {
    return (
      <div>
        <div className='field'>
          <a className='ui blue labeled icon button' href='/organizer/meetings'>
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
                {this.currentVal('name')}
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
                {this.currentVal('startDate')} - {this.currentVal('stopDate')}
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
                {this.currentVal('description')}
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
                {this.currentVal('question')}
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
                  {this.anwersVal()}
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
                {this.currentVal('status')}
              </td>
            </tr>

          </tbody>
        </table>
        <div className='field'>

          {this.currentVal('status')=="finished"?
          <div>
            <a className='ui blue button' href="">
              <i className='download icon'></i>
              Экспорт в файл
            </a>
            <a className='ui blue button' href={'/organizer/meetings/results/' + this.props.meet_id}>
              <i className='list icon'></i>
              Посмотреть итоги
            </a>
          </div>
          :
          <div>
            <a className='ui blue labeled icon button' href={'/organizer/meetings/reester/'+this.props.meet_id}>
              <i className='sidebar icon' />
              Посмотреть реестр
            </a>
            <a className='ui green labeled icon button' onClick={this.generate}>
              <i className='plus icon' />
              Создать реестр
            </a>
          </div>
         }
        </div>
      </div>
    );
  }
});
