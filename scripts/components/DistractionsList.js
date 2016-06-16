'use strict'

import React from 'react';
/*
distractions = {this.props.distractions}
currentSession={this.props.currentSession}
activityKey={this.props.currentSession['activity']
*/
var DistractionsList = React.createClass({
  renderDistraction : function(key) {
    var distractions = this.props.distractions;
    console.log('beginning of renderDistraction');
    console.log("distractions[key].text:");
    console.log(distractions[key].text);
    return (
      <li
        key={key}>
        {distractions[key].text}
      </li>
    )
  },
  render : function() {
    var distractions = this.props.distractions;
    var currentSession= this.props.currentSession;
    var activityKey= this.props.currentSession['activity'];
    var nDistractions = Object.keys(distractions).length;
    var lexicalThis = this;

    return (
      <div className="distractions-list">
        Trivial sundries.
        <div>nDistractions: { nDistractions > 0 ? nDistractions : "0"}</div>
        <div>currentSession: {currentSession.name}</div>
        <div>activityKey: {activityKey}</div>
        <ol>
          {Object.keys(distractions).map(lexicalThis.renderDistraction)}
        </ol>
      </div>
    )
  }
});

export default DistractionsList;
