'use strict'

import React from 'react';
/*
distractions = {this.props.distractions}
currentSession={this.props.currentSession}
activityKey={this.props.currentSession['activity']
*/
var DistractionsList = React.createClass({

  render : function() {
    var distractions = this.props.distractions;
    var currentSession= this.props.currentSession;
    var activityKey= this.props.currentSession['activity'];
    var nDistractions = Object.keys(distractions).length;

    return (
      <div className="distractions-list">
        Trivial sundries.
        <div>nDistractions: { nDistractions > 0 ? nDistractions : "0"}</div>
        <div>currentSession: {currentSession.name}</div>
        <div>activityKey: {activityKey}</div>
      </div>
    )
  }
});

export default DistractionsList;
