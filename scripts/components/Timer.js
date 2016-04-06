'use strict'

import React from 'react';
import FontAwesomeExample from './FontAwesomeExample';
//import Activities from '../main';

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
      singlePomodoroInSeconds : 1,
      fiveSeconds : 5,
    }
  },
  initializePomodoro : function(event) {
    event.preventDefault();
    this.setState({
      initializedAt : Math.floor((new Date().getTime())/1000),
    });

    this.props.updateActivityProperty(this.props.activityKey,'status','in-progress');
    this.startOrResumeCounting();
  },
  startOrResumeCounting : function(event) {
    if (event) {
      event.preventDefault();
    }
    if (this.state.isRunning === false) {
      this.setState({
        lastCountedAt : Math.floor((new Date().getTime())/1000),
        isRunning : true
      });
      this.countTime();
    } else {
      console.log("do nothing");
    }
  },
  interruptCounting : function() {
    this.setState({
      isRunning : false
    });
  },
  pauseHandler : function(event) {
    event.preventDefault();
    this.interruptCounting();
  },
  clearEverything : function(event) {
    event.preventDefault();
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
      //console.log("inside first `if` of countTime, totalElapsed");
      //console.log(totalElapsed);
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
  finishPomodoro : function() {
    this.interruptCounting();
    //this.props.updateActivityProperty(this.props.activityKey,'status','done');
    this.props.markDoneActivity(this.props.activityKey);
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
  render : function() {
    var totalElapsed = this.state.totalElapsed;
    var prettyTime = this.prettyFormatSeconds(totalElapsed);
    var activities = this.props.activities;
    var activityKey = this.props.activityKey;
    var currentActivityName = activities[activityKey].text;

      // first time running a Pomodoro session
    if (!this.state.isRunning && this.state.totalElapsed === null) {
      return (
        <span className="">
          {/*
          <button
            onClick={this.initializePomodoro}
            className='btn btn-primary pom-button start-pomodoro'>begin Pomodoro</button>
            */}
          <a href="#"
            onClick={this.initializePomodoro}
            className='start-pomodoro'><i className="fa fa-play fa-fw"></i></a>
        </span>
    )
  } else {
    // ELSE, WE ARE IN THE MIDDLE OF A TIMED SESSION
    return (
      <div className="row fullscreen-mid-pomodoro">
        <div className='current-activity col-xs-12 col-sm-10 col-md-8 center-block'>
          {currentActivityName} : {activities[activityKey].status}
        </div>
        <div className='col-xs-12 col-sm-10 col-md-8 timer-wrapper center-block'>
          <button
            onClick={this.pauseHandler}
            className='btn btn-lg timer-control'>
            <i className="fa fa-pause fa-2x pull-left"></i> </button>
          <button
            onClick={this.startOrResumeCounting}
            className='btn btn-lg timer-control'>
            <i className="fa fa-play fa-2x pull-left"></i> </button>
          <button
            onClick={this.clearEverything}
            className='btn btn-lg timer-control'>
            <i className="fa fa-stop fa-2x pull-left"></i> </button>
          <section className='elapsed-counter'>
            {/*
            <caption>total elapsedTime: <br/><span className="elapsed">{prettyTime}</span></caption>
            */}
            <span className="elapsed">{prettyTime}</span>
          </section>
        </div>
        {/*
        <FontAwesomeExample />
          */}
        {/*
          <Distractions className="row" />
          */}
      </div>
    )
  }

  }
});

export default Timer;
