import React from 'react';
import Formsy from 'formsy-react';
import classNames from 'classnames';

export default React.createClass({
  mixins: [Formsy.Mixin],
  getDefaultProps() {
    return {
      adds: {
        left:  { buttons: [] },
        right: { buttons: [] }
      }
    }
  },

  changeValue(event) {
    if (this.props.onChg) this.props.onChg(event);
    this.setValue(event.currentTarget.value);
  },

  sideButtons(side) {
    if (!this.props.adds) return null;
    if (!this.props.adds[side]) return null;

    let buttons = this.props.adds[side].buttons;
    if (!buttons) return null;

    return buttons.map((button, idx) => {
      let cls = classNames({
        'ui icon button': true,
        'right labeled': button.name
      });
      let iconCls = `icon ${button.icon}`;

      return (
        <div key={idx} className={cls} onClick={button.action}>
          {button.name}
          <i className={iconCls}/>
        </div>
      );
    })
  },

  sideLabels(side) {
    if (!this.props.adds) return null;
    if (!this.props.adds[side]) return null;

    let labels = this.props.adds[side].labels;
    if (!labels) return null;
    let iconFirst = (side === 'right');

    return labels.map((label, idx) => {
      let icon = label.icon ? <i className={label.icon + " icon"} /> : null;
      return (
        <div key={idx} className={"ui label " + label.accent}>
          {iconFirst ? icon : label.name}
          {iconFirst ? label.name : icon}
        </div>
      );
    });
  },

  ballon() {
    if (!this.props.adds.pointed) return null;
    return (
      <div className="ui pointing basic label">
        {this.props.adds.pointed}
      </div>
    );
  },

  classes() {
    let left  = this.props.adds.left;
    let right = this.props.adds.right;
    let leftButtons  = left  && left.buttons  && left.buttons.length;
    let rightButtons = right && right.buttons && right.buttons.length;
    let leftLabels   = left  && left.labels   && left.labels.length;
    let rightLabels  = right && right.labels  && right.labels.length;

    let params = {
      action:  (leftButtons || rightButtons)?true:false,
      left:    leftButtons  || leftLabels,
      right:   rightButtons || rightLabels,
      labeled: leftLabels   || rightLabels
    }
    if (this.props.icon) params[this.props.icon + " icon"] = true;  //"[iconame] [derection] icon"
    return classNames(params);
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
    let input = <input {...this.props} onChange={this.changeValue} value={this.getValue()} />;
    let label = this.props.label ? <label>{this.props.label}</label> : null;
    let icon  = this.props.icon ? <i className={"icon " + this.props.icon} /> : null;

    return (

      <div className="field">
        {label}
        <div className={"ui " + (this.props.adds?this.classes():'') +  ' input'}>
          {this.sideLabels('left')}
          {this.sideButtons('left')}
          {icon}
          {input}
          {this.sideButtons('right')}
          {this.sideLabels('right')}
        </div>
        {this.ballon()}
      </div>
    );
  }
});
