import React from 'react';
import Formsy from 'formsy-react';
import {Companies, Meetings, Users} from '/both/collections';
import Semantic from '/client/components/semantic';

export default React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {
      errorMessage: null,
      allowSubmit: false,
      masked: false,
      startDate:false,
      stopDate:false
    };
  },

  newMeet(event) {
    let currVals = this.refs.meet.getCurrentValues();
    var reg="\n";
    currVals.answers=currVals.answers.split(reg);
    currVals.pubkey=Meteor.user().profile.key.address;
    Meteor.call('meeting_add',
      currVals,
      function(error, result) {
        if (result) {
          //console.log(1);
          console.log(result);
        } else {
          //console.log(2);
          //console.log(error);
          FlowRouter.go('/organizer/meetings');
        }
      }
    );
  },
  saveMeet(event) {
    let currVals = this.refs.meet.getCurrentValues();
    var reg="\n";
    currVals.answers=currVals.answers.split(reg);
    //console.log(arr);
    Meteor.call('meeting_update', this.data.meeting._id, currVals, function(error, result) {
      if (result) {
        this.setState({errorMessage: err.message});
      } else {
        FlowRouter.go('/organizer/meetings');
      }
    });
  },
  generate(){
    if (confirm('Start generating?')) {
      //let $this=this;
      let id = this.props.meet_id;
      //var accounts = new Accounts({minPassphraseLength: 6});

      // var i = 0;
      // for(var i=0; i<10; i++){
      //   var accountObject = accounts.new('myPassphrase');
      //   let user = {
      //     emails: [
      //       { address: 'user'+i+'@company.name', verified: true }
      //     ],
      //     email: 'user'+i+'@company.name',
      //     username:  'user'+i,
      //     shares: ( Math.random() * Math.pow( 10, (Math.random()*10).toFixed(0) ) ).toFixed(0),
      //     // company: Meteor.user().company,
      //     meeting: id,
      //     account: accountObject
      //   };
      //   console.log(user);
      //   Users.insert(user, (err, id) => {
      //     Roles.addUsersToRoles(id, ['owner']);
      //     Accounts.setPassword(id, '123qwe');
      //   });
      // }
      //return user;
      // Meetings.update(id, {
      //   $set: {status: "started"}
      // }, function(err) {
      //   if (!err) {
      //     return false
      //   } else {
      //     return err
      //   }
      // });

      //
      Meteor
        .call('generate', this.props.meet_id, function(error, result) {
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
      companies: Companies.find({}, { sort: { name: 1 } }).fetch(),
      meeting: Meetings.findOne({_id: this.props.meet_id})
    };
  },
  currentVal(what) {
    return this.state[what]?this.state[what]:(this.data.meeting ? this.data.meeting[what] : '');
  },
  anwersVal() {
    let answers=this.currentVal('answers');
    let reg = ""
    return answers?($.isArray(answers)?answers.join('\n'):answers):'';
  },
  componentDidMount() {
    if(!this.state.masked){
      let $this = this;
      $(".datestart").datepicker({
        "dateFormat":"dd.mm.yy",
        onSelect : (text)=>{
          $this.setState({startDate:text});
        }
      });
      $(".datestop").datepicker({
        "dateFormat":"dd.mm.yy",
        onSelect : (text)=>{
          $this.setState({stopDate:text});
        }
      });
      this.setState({masked:true});
    }
  },
  render() {
    //this.published = this.currentVal('published') ? 'checked' : false;
    return (
      <div>

        <Formsy.Form key={this.props.k} className='ui form'
        onValidSubmit={this.newCurr} onValid={this.allowSubmit} onInvalid={this.disallowSubmit}
        ref='meet'>
          <div className='field'>
            <a className='ui blue labeled icon button' href='/organizer/meetings'>
              <i className='arrow left icon' />
              Назад
            </a>
          </div>
          <Semantic.Input name='name'
          label='Название' validations='minLength:3' placeholder='Введите тему собрания'
          required value={this.currentVal('name')} />
          <Semantic.Input name='startDate' className="datestart"
          label='Дата начала' validations='minLength:3' placeholder='Введите дату начала голосования'
          required value={this.currentVal('startDate')} ref="startDate" />
          <Semantic.Input name='stopDate' className="datestop"
          label='Дата окончания' validations='minLength:3' placeholder='Введите дату окончания голосования'
          required value={this.currentVal('stopDate')} ref="stopDate" />
          <Semantic.Text name="description" label="Описание"  validations='minLength:3'
          placeholder='Введите информацию о собрании' required value={this.currentVal('description')} rows="2" />
          <Semantic.Text name="question" label="Вопрос на голосование"  validations='minLength:3'
          placeholder='Введите вопрос для голосования' required value={this.currentVal('question')} rows="2" />
          <Semantic.Text name="answers" label="Ответы"  validations='minLength:3'
          placeholder='Введите варианты ответов, каждый с новой строки' required value={this.anwersVal()} rows="4" />
          <div className='two fields'>


              <a className='ui positive labeled right aligned icon button'
                onClick={this.props.meet_id ? this.saveMeet : this.newMeet}>
                <i className='checkmark icon' />
                Сохранить черновик
              </a>
              {this.props.meet_id ?
                <a className='ui blue labeled icon button' href={'/organizer/meetings/reester/'+this.props.meet_id}>
                  <i className='sidebar icon' />
                  Посмотреть реестр
                </a>
              : null}
              {this.props.meet_id ?
                <a className='ui green labeled icon button' onClick={this.generate}>
                  <i className='plus icon' />
                  Создать реестр
                </a>
              : null}


          </div>
        </Formsy.Form>
      </div>
    );
  }
});
