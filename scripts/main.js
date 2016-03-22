"use strict"

var React = require('react');
var ReactDOM = require('react-dom');

//import {Timer} from "./components/timer.jsx";
var Timer = require("./components/timer.js");
var Distractions = require("./components/distractions.js");

var App = React.createClass({
  getInitialState : function() {
    return {
      activityInput : "",
      activities : [],
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
  markDoneActivity : function(key) {
    this.state.activities[key].status = "done";
    this.state.activities[key].isFinished = true;
    this.setState({
      activities : this.state.activities,
    })
  },
  render : function(){
    return (
      <div>
        <h4>Enter a task or Pomodoro activity, yo</h4>
        <Activities
            activities = {this.state.activities}
            activityInput = {this.state.activityInput}
            updateActivityInput={this.updateActivityInput}
            addActivity={this.addActivity}
            deleteActivity={this.deleteActivity}
        />
        <p><em>so far you wrote:</em> <span className='text-muted'>({this.state.activityInput.length}):{this.state.activityInput}</span></p>
        <Timer />
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
    var activities = this.props.activities;
    console.log('\n\n\n\n\n\ninside renderActivity');
    return (
      <div>
        <li key={key}>
          <span className="activity-key">key: {key}</span>
          <span className="activity-text">{item.text}</span>
          <span className="activity-delete">
            <a href='#' onClick={ function() {this.props.deleteActivity(key)}.bind(this)}>X </a>
          </span>

        </li>
      </div>
    )
  },
  render : function() {
    var activities = this.props.activities;
    return (
      <div>
        <ol className='activities-ol'>
          {Object.keys(activities).map(
            function(key) {
              return this.renderActivity(activities[key],key);
            }.bind(this)
          )}
        </ol>
        <form
          ref='activityForm'
          onSubmit={this.createActivity}
          className='form-inline'
        >
          <input
            ref='name'
            onChange={this.props.updateActivityInput}
            type='text'
            value={this.props.activityInput}
            className='form-control'
          />
          {/*
          <button className='btn btn-default'>(+) task</button>
          */}
          <button disabled={this.props.activityInput.length===0} className='btn btn-default'>(+) task</button>
        </form>
      </div>
    )
  },
});


ReactDOM.render(
  <App />,
  document.querySelector(".container")
);
