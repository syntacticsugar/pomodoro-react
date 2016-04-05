"use strict"

var React = require('react');
var ReactDOM = require('react-dom');

//import {Timer} from "./components/timer.jsx";
var Timer = require("./components/Timer.js");
var Distractions = require("./components/Distractions.js");
import FontAwesomeExample from './components/FontAwesomeExample';
import Done from './components/Done';

var App = React.createClass({
  getInitialState : function() {
    return {
      activityInput : "",
      activities : {},
      //done : []
      done : {}
    }
  },
  // state has been updated
  componentDidUpdate : function() {
    //console.log("componentDidUpdate.")
  },
  // updateActivityInput is a callback for the onChange event listener
  updateActivityInput : function(event) {
    this.setState({ activityInput : event.target.value })
  },
  addActivity : function(activity) {
    var timestamp = (new Date).getTime();
    this.state.activities['activity-' + timestamp] = activity;
    this.setState({
      activities : this.state.activities,
      activityInput : ""
    });
  },
  deleteActivity : function(index) {
    // prevent refresh
    //event.preventDefault();
    delete this.state.activities[index];
    this.setState({
      activities : this.state.activities,
    })
  },
  updateActivityProperty : function(key,propertyName,value) {
    this.state.activities[key][propertyName] = value;
    this.setState({ activities : this.state.activities });
    //console.log('inside updateActivityProperty in main.js');
  },
  markDoneActivity : function(key) {
    this.state.activities[key].status = "done";
    this.state.activities[key].isFinished = true;
    //this.state.done.push(this.state.activities[key]);
    console.log('try to update "done":');
    console.log(this.state.done);
    console.log(key);
    this.state.done[key] = key;
    console.log(this.state.done);
    this.setState({
      activities : this.state.activities,
      //done : this.state.done,
    });
    this.setState({done : this.state.done});
    //alert("key:" + key);
    //alert(key);
  },
  render : function(){
    return (
      <div>
        <h1 className="logo">
          <img className="tiny-tomato" src="images/bit-red-tomato-tiny.png" /><img src="images/logo.png" />
        </h1>
        {/*
        <h4>Enter a task or Pomodoro activity, yo</h4>
        <span><em>so far you wrote:</em> <span className='text-muted'>({this.state.activityInput.length}):{this.state.activityInput}</span></span>
        */}
        <Activities
            activities = {this.state.activities}
            activityInput = {this.state.activityInput}
            updateActivityInput={this.updateActivityInput}
            updateActivityProperty={this.updateActivityProperty}
            markDoneActivity={this.markDoneActivity}
            addActivity={this.addActivity}
            deleteActivity={this.deleteActivity}
        />
        <Done
            activities={this.state.activities}
            done={this.state.done}
        />
        <br/><br/><br/>
      </div>
    )
  }
});

var Activities = React.createClass({
  createActivity : function(event) {
    event.preventDefault();

    var activity = {
      text : this.refs.name.value,
      status : 'new',
      isFinished : false,
      distractions : {},
      // forgot what this part is for:
      timesActivityWasCompleted : [],
      submitTime: (new Date().getTime()).toString(),
    };
    this.props.addActivity(activity);
    this.refs.activityForm.reset();
  },
  renderActivity : function(item,key) {
    //console.log('\n\n\n\n\n\ninside renderActivity');
    if (item.status != 'done') {
      return (
          <li key={key}>
            {/*
            <span className="activity-key">key: {key}</span>
            */}
            <span className="activity-text">{item.text} </span>
            <span className="activity-status">({item.status})</span>
            <span className="activity-delete">
              <a href='#' onClick={ function() {this.props.deleteActivity(key)}.bind(this)}>
                <i className="fa fa-trash-o"></i>
                delete
              </a>
            </span>
            <span className="activity-start">
              <Timer
                activityKey={key}
                activities={this.props.activities}
                markDoneActivity={this.props.markDoneActivity}
                updateActivityProperty={this.props.updateActivityProperty}
              />
            </span>
          </li>
      )
    }

  },
  render : function() {
    var activities = this.props.activities;
    return (
      <div>
        <form
          ref='activityForm'
          onSubmit={this.createActivity}
          className='form-inline'
        >
          <div className="row">
            <div className="input-group">
              <span className="input-group-addon"><i className="fa fa-pencil fa-fw fa-lg"></i></span>
              <input
                  ref='name'
                  onChange={this.props.updateActivityInput}
                  type='text'
                  value={this.props.activityInput}
                  className="form-control input-activity"
              />
            </div>
            {/*
            <button className='btn btn-default'>(+) task</button>
            */}
            <button
              disabled={this.props.activityInput.length===0}
              className='btn btn-default submit-task'
              type='submit'
              ><i className="fa fa-plus fa-fw fa-lg"></i>
            </button>
          </div>
        </form>
        <ol className='activities-ol'>
          {Object.keys(activities).map(
            function(key) {
              return this.renderActivity(activities[key],key);
            }.bind(this)
          )}
        </ol>
      </div>
    )
  },
});


ReactDOM.render(
  <App />,
  document.querySelector(".container")
);
