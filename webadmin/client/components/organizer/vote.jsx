import React from 'react';
import Formsy from 'formsy-react';
import {Companies, Meetings} from '/both/collections';
import Semantic from '/client/components/semantic';

export default React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {
      choice: false,
      company: false
    };
  },

  setVoted(item, event){
    if (!Meteor.user()) { return; }
    let el = $(event.currentTarget);
    $('.vote').removeClass('positive');
    el.addClass('positive');
    this.setState({choice: el.attr('data-vote')});
    // el.attr('disabled', true);
    // Meteor.call('jobs/wallet/newWallet', item._id, () => {
    //   el.removeClass('loading');
    //   el.attr('disabled', false);
    // });
  },
  saveDraft(){
    Meteor.call('my_choice', {meeting: this.props.meet_id, choice: this.state.choice}, () => {
      FlowRouter.go('/organizer/meetings');
    });
  },
  getCompanyName(id){
    let comp = _.findWhere(this.data.companies, {
      _id: id
    });
    return comp
      ? comp.shortName
      : '';
  },
  getVoted(){
    let req = {
      meeting: this.data.meeting,
      choice: {
        num: this.state.choice,
        text: this.data.meeting.answers[this.state.choice-1]
      },
      company: this.state.company
    };
    console.log(req);
    Meteor.call('vote', req, (result) => {
      if(result){
        FlowRouter.go('/organizer/meetings');
      }else{
        alert('error!');
      }
    });
  },
  getMeteorData() {
    return {
      companies: Companies.find({}, { sort: { name: 1 } }).fetch(),
      //reester: Users.find({}, { sort: { name: 1 } }).fetch(),
      meeting: Meetings.findOne({_id: this.props.meet_id})
    };
  },
  currentVal(what) {
    return this.data.meeting ? this.data.meeting[what] : '';
  },
  anwersVal() {
    let answers=this.currentVal('answers');
    let reg = ""
    return answers?($.isArray(answers)?answers.join('\n'):answers):'';
  },
  renderAnswersList() {
    let answers=this.currentVal('answers');
    let i=0;
    if(answers&&$.isArray(answers)){
      return answers.map((answer) => {
        i++;
        return (
          <div className="item" key={"answer"+i}>
            <div className="right floated content">
              <div className="ui icon button vote" onClick={this.setVoted.bind(this, answer)} data-vote={i}>
                <i className="checkmark icon"></i>
              </div>
            </div>
            <i className="caret right icon"></i>
            <div className="content">
              {answer}
            </div>
          </div>
        );
      });
    }
  },
  allowSubmit() { this.setState({allowSubmit: true}); },
  disallowSubmit() { this.setState({allowSubmit: false}); },
  componentDidMount() {
    let my_choice = this.data.meeting.my_choice;
    $('.vote').removeClass('positive');
    this.setState({choice: my_choice||false});
    if(my_choice){ $('[data-vote='+my_choice+']').addClass('positive'); }
    if(!this.state.company){
      this.setState({company: this.getCompanyName(this.data.meeting.company)})
    }
  },
  render() {
    //this.published = this.currentVal('published') ? 'checked' : false;
    console.log(Meteor.user().company);
    return (
      <div>
        <div className='field'>
          <a className='ui blue labeled icon button' href='/organizer/meetings'>
            <i className='arrow left icon' />
            К списку собраний
          </a>
          <a className='ui blue labeled icon button' href={'/organizer/meetings/view/' + this.props.meet_id}>
            <i className='list left icon' />
            Информация о собрании
          </a>
        </div>
        <div className="ui header">
          {this.currentVal('question')}
        </div>
        <div className="ui middle aligned divided list">
          {this.renderAnswersList()}

        </div>
        <div className='field'>
          <a className='ui blue labeled icon button' onClick={this.saveDraft}>
            <i className='save icon' />
            Сохранить черновик
          </a>
          <a className='ui green labeled icon button' onClick={this.getVoted}>
            <i className='checkmark icon' />
            Проголосовать
          </a>
        </div>
      </div>
    );
  }
});
