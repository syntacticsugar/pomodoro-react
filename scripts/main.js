"use strict"

var React = require('react');
var ReactDOM = require('react-dom');
var CSSTransitionGroup = require('react-addons-css-transition-group');

//import {Timer} from "./components/timer.jsx";
var Timer = require("./components/Timer.js");
var Distractions = require("./components/Distractions.js");
var Activities = require("./components/Activities.js");
import FontAwesomeExample from './components/FontAwesomeExample';
import Done from './components/Done';

var App = React.createClass({
  getInitialState : function() {
    return {
      activityInput : "",
      activities : {},
      //done : []
      done : {},
      //currentActivity : null, /* "activity-123456" */
      currentSession : null,
      /*
      currentSession : {
        activity : "activity-123456",
        name : "My #1 Task",
        isRunning : true,
        startedAt : ...,
        totalElapsed : ...,

      }
      */
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

  createAndInitializeNewSession : function(activityKey) {
    this.state.activities[activityKey].status = 'in-progress';

    var timeAtInitialization = Math.floor((new Date().getTime())/1000);

    this.state.currentSession = {
          activity : activityKey,
          name : this.state.activities[activityKey].text,
          isRunning : true,
          initializedAt : timeAtInitialization,
          totalElapsed : 0,
          lastCountedAt : timeAtInitialization,
          singlePomodoroInSeconds : 5,
    };

    this.setState({
      activities : this.state.activities,
      currentSession : this.state.currentSession,
    });

    console.log('just setState in createAndInitializeNewSession');
    console.log(this.state.currentSession);

    this.countTime();
  },
  pauseOrResumeSession : function() {

    if (this.state.currentSession.isRunning) {
      // stop the clock
      this.state.currentSession.isRunning = false;
      this.setState({ currentSession :  this.state.currentSession });
    } else {
      // restart
      var currentTime = Math.floor((new Date().getTime())/1000);
      this.state.currentSession.isRunning = true;
      this.state.currentSession.lastCountedAt = currentTime;
      this.setState({ currentSession :  this.state.currentSession });
      this.countTime();
    }
  },
  abandonSession : function() {
    console.log('abandonSession: this.state.currentSession');
    console.log(this.state.currentSession);
    var activityKey = this.state.currentSession.activity;
    this.state.activities[activityKey].status = 'abandoned';
    this.setState({
      activities : this.state.activities,
      currentSession : null,
    });
  },
  completeSession : function() {
    var activityKey = this.state.currentSession.activity;
    //this.state.activities[activityKey].status = 'done';
    //this.state.activities[activityKey].isFinished = true;
    this.markDoneActivity(activityKey);
    this.setState({
      //activities : this.state.activities,
      currentSession : null,
    });

  },

  countTime : function() {
    console.log('starting countTime');
    console.log(this.state.currentSession);
    var totalElapsed = this.state.currentSession.totalElapsed;
    var isRunning = this.state.currentSession.isRunning;
    var lastCountedAt = this.state.currentSession.lastCountedAt;
    var singlePomodoroInSeconds = this.state.currentSession.singlePomodoroInSeconds;
    //if (this.state.totalElapsed > 1 && this.state.totalElapsed < 1500) {
    //if (this.state.totalElapsed > 1) {
    //if (totalElapsed !== null && totalElapsed < singlePomodoroInSeconds) {
    //console.log("totalElapsed & singlePomodoroInSeconds");
    //console.log(totalElapsed);
    //console.log(singlePomodoroInSeconds);


    if (totalElapsed < singlePomodoroInSeconds) {
      console.log('totalElapsed < singlePomodoroInSeconds');
      //console.log("inside first `if` of countTime, totalElapsed");
      //console.log(totalElapsed);
      setTimeout( function() {
        if (isRunning) {
          var currentTime = Math.floor((new Date().getTime())/1000);
          var newTotalElapsed = (currentTime - lastCountedAt) + totalElapsed;
          this.state.currentSession.totalElapsed = newTotalElapsed;
          this.state.currentSession.lastCountedAt = currentTime;
          this.setState( { currentSession : this.state.currentSession });

          // recursively run again and again
          this.countTime();
        }
      // 'this' binds the value of `this` to Timer component
      }.bind(this),1000);
    } else if (totalElapsed >= singlePomodoroInSeconds) {
      this.completeSession();
    }
  },

  render : function(){
      if (this.state.currentSession) {
        return (
          <div>
            <Timer
              currentSession={this.state.currentSession}
              pauseOrResumeSession={this.pauseOrResumeSession}
              //completeSession={this.completeSession}
              abandonSession={this.abandonSession}
              //activityKey={this.state.currentActivity}
              //setEnableAnimations={this.setEnableAnimations}
              activities={this.state.activities}
              markDoneActivity={this.markDoneActivity}
              updateActivityProperty={this.updateActivityProperty}
            />
          </div>
        )
      } else {
        return (
          <div>
            <h1 className="logo">
              <img className="tiny-tomato" src="images/bit-red-tomato-tiny.png" /><img src="images/logo.png" />
            </h1>

            <Activities
                activities = {this.state.activities}
                activityInputIsFocused = {this.state.activityInputIsFocused}
                activityInput={this.state.activityInput}
                createAndInitializeNewSession={this.createAndInitializeNewSession}
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
  }
});



ReactDOM.render(
  <App />,
  document.querySelector(".container")
);
