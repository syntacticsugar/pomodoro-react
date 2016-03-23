'use strict'

import React from 'react';

var Timer = React.createClass({
  getInitialState : function() {
    return {
      // null is not type specific
      initializedAt : null,
      lastCountedAt : null,
      // totalElapsedTimeActuallyWorkingOnTask
      totalElapsed: null,
      isRunning : false,
      //timeAtPause : null,
      //singlePomodoroInSeconds : 25*60, // (1500)
      singlePomodoroInSeconds : 60*25,
      fiveSeconds : 5,
    }
  },
  initializePomodoro : function(event) {
    console.log('initialize pomodoro');
    console.log(this.props);
    this.setState({
      initializedAt : Math.floor((new Date().getTime())/1000),
    });

    this.props.updateActivityProperty(this.props.activityKey,'status','in-progress');
    this.startCounting();
  },
  startCounting : function() {
    this.setState({
      lastCountedAt : Math.floor((new Date().getTime())/1000),
      isRunning : true
    });
    this.countTime();
  },
  interruptCounting : function(event) {
    this.setState({
      isRunning : false
    });
  },
  clearEverything : function(event) {
    this.setState( {
      initializedAt : null,
      lastCountedAt : null,
      totalElapsed: null,
      isRunning : false,
    });
  },
  countTime : function() {
    var totalElapsed = this.state.totalElapsed;
    var singlePomodoroInSeconds = this.state.singlePomodoroInSeconds;
    //if (this.state.totalElapsed > 1 && this.state.totalElapsed < 1500) {
    //if (this.state.totalElapsed > 1) {
    //if (totalElapsed !== null && totalElapsed < singlePomodoroInSeconds) {
    if (totalElapsed < singlePomodoroInSeconds) {
      console.log("inside first `if` of countTime, totalElapsed");
      console.log(totalElapsed);
      setTimeout( function() {
        if (this.state.isRunning) {
          var currentTime = Math.floor((new Date().getTime())/1000);
          var newTotalElapsed = (currentTime - this.state.lastCountedAt) + totalElapsed;
          this.setState( {
            //totalElapsed : this.prettyFormatSeconds(newTotalElapsed),
            totalElapsed : newTotalElapsed,
            lastCountedAt : Math.floor((new Date().getTime())/1000),
          });
          // recursively run again and again
          this.countTime();
        }
      // 'this' binds the value of `this` to Timer component
      }.bind(this),1000);
    } else if (totalElapsed >= singlePomodoroInSeconds) {
      this.finishPomodoro();
    }
  },
  prettyFormatSeconds : function(seconds) {

    var minutes, leftoverSecs, results;

    if (seconds !== null) {
      if (seconds === 1) {
        //return seconds + "{<span className='pretty-seconds'>} second{</span>}";
        return seconds + " second";
      }
      else if (seconds >= 60) {
        leftoverSecs = seconds % 60;
        minutes = Math.floor(seconds / 60);
        // format :01, :02, :03, etc
        if (leftoverSecs < 10) {
          leftoverSecs = "0" + leftoverSecs;
        }
        results = minutes + ":" + leftoverSecs;
      }
      else if (seconds >= this.state.singlePomodoroInSeconds) {
        results = "Finito, NICE JOB."
      }
      else {
        if (seconds > 1) {
          //return seconds + "{<span className='pretty-seconds'>} seconds{</span>}";
          return seconds + " seconds";
        }
      }
    }
    return results;
  },
  finishPomodoro : function() {
    this.interruptCounting();

  },
  render : function() {
    var totalElapsed = this.state.totalElapsed;
    var prettyTime = this.prettyFormatSeconds(totalElapsed);
    var activities = this.props.activities;
    var activityKey = this.props.activityKey;

    // console.log('inside render, totalElapsed and pretty');
    //console.log(totalElapsed);
    //console.log(prettyTime);
    console.log('\n\n\n\n\n INSIDE RENDER:');
    console.log('activities:');
    console.log(activities);
    console.log('activities[activityKey]:');
    console.log(activities[activityKey]);
    // console.log(key);
    // first time running a Pomodoro session
    if (!this.state.isRunning && this.state.totalElapsed === null) {
      return (
        <div className="">
          <h1>{this.props.activities[activityKey].text}</h1>
          <button
            onClick={this.initializePomodoro}
            className='btn btn-primary pom-button start-pomodoro'>begin Pomodoro</button>
          {/*<p>total elapsedTime: {this.prettyFormatSeconds(totalElapsed)}</p>*/}
          <p>total elapsedTime: {totalElapsed}</p>
        </div>
    )
  } else {
    // ELSE, WE ARE IN THE MIDDLE OF A TIMED SESSION
    return (
      <div className="row fullscreen-mid-pomodoro">
        <div className='col-xs-12 col-sm-10 col-md-8 timer-wrapper'>
          <button
            onClick={this.interruptCounting}
            className='btn btn-default pom-button start-pomodoro'>pause</button>
          <button
            onClick={this.startCounting}
            className='btn btn-primary pom-button start-pomodoro'>resume</button>
          <button
            onClick={this.clearEverything}
            className='btn btn-warning pom-button start-pomodoro'>STOP/reset</button>
          <p>total elapsedTime: <br/><span className="elapsed">{prettyTime}</span></p>
        </div>
        {/*
          <Distractions className="row" />
          */}
      </div>
    )
  }

  }
});

export default Timer;
