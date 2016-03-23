"use strict"

var React = require('react');
var ReactDOM = require('react-dom');

//import {Timer} from "./components/timer.jsx";
var Timer = require("./components/Timer.js");
var Distractions = require("./components/Distractions.js");

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
  updateActivityProperty : function(key,propertyName,value) {
    this.state.activities[key][propertyName] = value;
    this.setState({ activities : this.state.activities });
    console.log('inside updateActivityProperty in main.js');
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
        <h1>Pom-a-GoGo</h1>
        <h4>Enter a task or Pomodoro activity, yo</h4>
        <Activities
            activities = {this.state.activities}
            activityInput = {this.state.activityInput}
            updateActivityInput={this.updateActivityInput}
            updateActivityProperty={this.updateActivityProperty}
            addActivity={this.addActivity}
            deleteActivity={this.deleteActivity}
        />
        <span><em>so far you wrote:</em> <span className='text-muted'>({this.state.activityInput.length}):{this.state.activityInput}</span></span>
        <br/><br/><br/>
        <h2>Standalone Timer:</h2>
        <Timer
            activities={this.state.activities}
            updateActivityProperty={this.updateActivityProperty}
        />
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
    console.log('\n\n\n\n\n\ninside renderActivity');
    return (
      <div>
        <li key={key}>
          <span className="activity-key">key: {key}</span>
          <span className="activity-text">{item.text} </span>
          <span className="activity-text">({item.status})</span>
          <span className="activity-delete">
            <a href='#' onClick={ function() {this.props.deleteActivity(key)}.bind(this)}>X </a>
          </span>
          <span className="activity-start">
            <Timer
              activityKey={key}
              activities={this.props.activities}
              updateActivityProperty={this.props.updateActivityProperty}
            />
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
