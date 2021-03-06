'use strict'

import React from 'react';
import FontAwesomeExample from './FontAwesomeExample';
import AddDistractionForm from './AddDistractionForm';
import DistractionsList from './DistractionsList';
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
      singlePomodoroInSeconds : 12*60,
      fiveSeconds : 5,
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
          <div className="fullscreen-inner-wrapper">
            <div className='current-activity col-xs-12 col-sm-10 col-md-8 center-block'>
              {this.props.currentSession.name} : in-progress
            </div>
            <div className='col-xs-12 col-sm-10 col-md-8 timer-wrapper center-block'>
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
                <span className="elapsed">{prettyTime}</span>
              </section>

              <AddDistractionForm
                updateDistractionInput = {this.props.updateDistractionInput}
                addDistraction = {this.props.addDistraction}
                distractions = {this.props.distractions}
                distractionInput={this.props.distractionInput}
                currentSession={this.props.currentSession}
                activityKey={this.props.currentSession['activity']}
              />

              <DistractionsList
                  distractions = {this.props.distractions}
                  currentSession={this.props.currentSession}
                  activityKey={this.props.currentSession['activity']}
              />
            </div>
          </div>
        </div>
      </span>
    )

  }
});

export default Timer;
