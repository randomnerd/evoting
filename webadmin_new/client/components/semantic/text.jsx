import React from 'react';
import Formsy from 'formsy-react';
import classNames from 'classnames';

export default React.createClass({
  mixins: [Formsy.Mixin],
  getDefaultProps() {
    return {

    }
  },

  changeValue(event) {
    if (this.props.onChg) this.props.onChg(event);
    this.setValue(event.currentTarget.value);
  },


  render() {
    let clsParams = {
      field:    true,
      required: this.showRequired(),
      error:    this.showError(),
      inline:   this.props.showInline
    };
    if (this.props.className) clsParams[this.props.className] = true;
    let cls = classNames(clsParams);

    let errorMessage = this.getErrorMessage();
    let text = <textarea {...this.props} onChange={this.changeValue} value={this.getValue()}></textarea>;
    let label = this.props.label ? <label>{this.props.label}</label> : null;

    return (

      <div className="field">
        {label}
        {text}
      </div>
    );
  }
});
