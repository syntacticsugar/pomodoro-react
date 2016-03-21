"use strict";

import React from 'react;
import ReactDOM from 'react-dom';
import Timer from './components/Timer';

var App = React.createClass({
  getInitialState : function() {
    return {
      currentActivityIndex: null,
      activities : {},
      finishedActivities : [],
    }
  },
  addActivityToState : function(newActivityText) {
    var timestamp = (new Date()).getTime();
    this.state.activities["activity-" + timestamp] = {
      kind : 'activity',
      text : newActivityText,
      submitTime : timestamp,
      status : 'new',
      completedTimes : [],
      isFinished : false,
      distractions : []
    }
    console.log(this.state.activities);
    this.setState({ activities : this.state.activities });
  },
  updateActivity : function() {
  },
  deleteActivityFromState : function(key) {
    delete this.state.activity[key];
    this.setState({ activities : this.state.activities });
  },
  addDistractionToState : function(activityKey, newDistractionText) {
    this.state.activities[activityKey].distractions.push(newDistractionText);
    this.setState({ activities : this.state.activities })
  },
  render : function() {
    var currentActivityIndex = this.state.currentActivityIndex;
    var activities = this.state.activities;

    if (currentActivityIndex !== null) {
      return (
      /* DISTRACTIONS */
        <div>
          <ListView
            data={ activities[currentActivityIndex].distractions.map ( function() {
              return {
                kind : 'distraction',
                text : x,
              }
            })}
            addToState={ function(distractionText) {
              this.addDistractionToState(currentActivityIndex,distractionText);
            }.bind(this)}
          />
        </div>
      )
    } else {
      return (
      /* ACTIVITIES:  */
        <div>
          <h1>Activities to Finish</h1>
          <ListView
            data={this.state.activities}
            addToState={this.addActivityToState}
            deleteItem={this.deleteActivityFromState}
          />
        </div>
      )
    }
  }
});

var ListView = React.createClass({ 
  createItem : function(event) {
    // prevent refresh
    event.preventDefault();

    var inputText = this.refs.inputText.value;

    // add to state
    this.props.addToState(inputText);

    // reset form
    this.refs.addItemForm.reset();
  },
  renderItem : function(item,key) {
    var lexicalThis = this;

    return (
      <li key={key}>
        <span>{item.text}</span>
        <a href="#" onClick={ function() {
          lexicalThis.deleteItem(key);
        }} >delete</a>
        <Timer />
      </li>
    );
  },

  render : function() {
    return (
      <div>
        <ol>
          { Object.keys(this.props.data).map( 
            function(key) {
              return this.renderItem(this.props.data[key],key);
            }.bind(this)
          )}
        </ol>
        <form ref='addItemForm' onSubmit={this.createItem}>
          <input ref='inputText' type='text' />
          <button type='sbmit'>Add</button>
        </form>
      </div>
    )
  }
});


function doTurn() {
  var steps = [rollDice(), move(), combat(), getCoins(), buyHealth(), printStatus()];
  for (step in steps) {
    return step;
  }
}


function shortcut(string){
  var vowels = ["a", "e", "i", "o", "u"];
  var vowelsJoined = "aeiou";
  var results = [];
  array = string.split("");
  for (var i = 0; i < array.length; i++) {
    if ( vowels.indexOf(array[i]) < 0 ) {
      results.push(array[i]);
    }
  }
  return results.join("");
}
