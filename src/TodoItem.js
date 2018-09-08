import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';

export default class TodoItem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      text: "",
      checked: false
    }

    this.checkbox = React.createRef();
  }

  componentDidMount() {
    if(this.props.text) {
      this.setState({text: this.props.text});
    }

    if(this.props.checked) {
      this.setState({checked: true});
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.text !== this.props.text) {
      this.setState({text: nextProps.text, checked: nextProps.checked});
    }
  }

  render() {
    return (
      <div className="toDoItems">
        <label className={`todoItemLabel ${this.state.checked?'checked':''}`}>
          <input
            className = "toDoItemInput"
            type="checkbox"
            ref={this.checkbox}
            onChange={(e) => {
                                this.setState({checked: e.currentTarget.checked});
                                if(this.props.callBack) {
                                  this.props.callBack(this.props.id, e.currentTarget.checked);
                                }
                              }}
            defaultChecked={this.props.checked}
            dataId={this.props.id}
          />
          {this.state.text}
        </label>
      </div>
    );
  }
}

TodoItem.propTypes = {
  text: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  id: PropTypes.number.isRequired,
  callBack: PropTypes.func
}