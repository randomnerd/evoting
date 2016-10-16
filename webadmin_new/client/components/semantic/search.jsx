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

  changeValue(event) {
    if (this.props.onChg) this.props.onChg(event);
    this.setValue(event.currentTarget.value);
  },

  onSelect(result) {
    this.setValue(result.title)
  },

  initSearch(source) {
    var el = $(this.refs.search);
    el.search({source: source, onSelect: this.onSelect});
  },

  componentDidMount() {
    this.initSearch(this.props.content)
  },

  componentWillReceiveProps(newProps) {
    this.initSearch(newProps.content)
  },

  render() {
    classes = [ 'field' ];
    if (this.showRequired())  classes.push('required');
    if (this.showError())     classes.push('error');
    if (this.props.showInline)     classes.push('inline');
    if (this.props.className) classes.push(this.props.className);


    errorMessage = this.getErrorMessage();
    input = <input {...this.props} onChange={this.changeValue} value={this.getValue()} className="prompt"/>;

    return (
      <div className={classes.join(' ')}>
        <div className="ui search" ref="search">
          {this.props.label ? <label>{this.props.label}</label> : ""}
          { this.props.icon ?
            <div className={"ui " + this.props.iconSide + ' icon ' + (this.props.labeled?'right labeled ':'') +  'input'}>
              {input}
              <i className={"icon " + this.props.icon} />
            </div>
          : {input} }
          <div className="results" > </div>
        </div>
      </div>
    );
  }
});
