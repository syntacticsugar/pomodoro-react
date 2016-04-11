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
      singlePomodoroInSeconds : 12,
      fiveSeconds : 5,
    }
  },
  startOrResumeCounting : function(event) {
    if (event) {
      event.preventDefault();
    }
    /*
    if (this.state.isRunning === false) {
      this.setState({
        lastCountedAt : Math.floor((new Date().getTime())/1000),
        isRunning : true
      });
      this.countTime();
    } else {
      console.log("do nothing");
    }
    */
  },
  pauseHandler : function(event) {
    event.preventDefault();
    this.interruptCounting();
  },
  toggleCounting : function(event) {
    event.preventDefault();
    this.props.pauseOrResumeSession();
  },
  finishPomodoro : function() {
    this.props.abandonSession();
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
    console.log('currentSession');
    console.log(this.props.currentSession);
    var totalElapsed = this.props.currentSession.totalElapsed;
    var prettyTime = this.prettyFormatSeconds(totalElapsed);
    //var activities = this.props.activities;
    //var activityKey = this.props.activityKey;
    var currentActivityName = this.props.currentSession['name'];

    // WE ARE IN THE MIDDLE OF A TIMED SESSION
    return (
      <span>
        <div className="row fullscreen-mid-pomodoro">
          <div className='current-activity col-xs-12 col-sm-10 col-md-8 center-block'>
            {this.props.currentSession.name} : {'in-progress (TODO fix this)'}
          </div>
          <div className='col-xs-12 col-sm-10 col-md-8 timer-wrapper center-block'>
           {/*
            <button
              onClick={this.pauseHandler}
              className='btn btn-lg timer-control'>
              <i className="fa fa-pause fa-2x pull-left"></i> </button>
            <button
              onClick={this.startOrResumeCounting}
              className='btn btn-lg timer-control'>
              <i className="fa fa-play fa-2x pull-left"></i> </button>
            */}
            <button
              onClick={this.props.pauseOrResumeSession}
              className='btn btn-lg timer-control'>
              <i className={"fa fa-2x " + (this.props.currentSession.isRunning ? "fa-pause" : "fa-play")}></i>
            </button>
            <button
              onClick={this.props.abandonSession}
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
      </span>
    )

  }
});

export default Timer;
