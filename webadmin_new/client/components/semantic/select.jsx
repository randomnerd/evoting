import React from 'react';
import Formsy from 'formsy-react';

export default React.createClass({
  mixins: [Formsy.Mixin],
  getDefaultProps() {
    return {
      icon: 'search',
      type: 'text',
      iconSide: 'left'
    }
  },

  onChange(result) {
    this.setValue(result)
  },

  componentDidMount() {
    $(this.refs.select).dropdown({onChange: (value)=>this.onChange(value)});
  },

  renderOptions(){
    return this.props.content.map((item) => {
      return  (
        <option key={item._id} value={item._id}>{item.title}</option>
      );
    });
  },

  render() {
    let classes = [ 'field' ];
    if (this.showRequired())  classes.push('required');
    if (this.showError())     classes.push('error');
    if (this.props.showInline)     classes.push('inline');
    if (this.props.className) classes.push(this.props.className);


    let errorMessage = this.getErrorMessage();


    return (
      <div className={classes.join(' ')}>
        {this.props.label ? <label>{this.props.label}</label> : ""}
        <select {...this.props} className="ui search dropdown" ref="select">
          <option key="0" value="">{this.props.placeholder}</option>
          {this.renderOptions()}
        </select>
      </div>
    );
  }
});
