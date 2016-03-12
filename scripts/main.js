"use strict";

var React = require('react');
var ReactDOM = require('react-dom');

var App = React.createClass({
  getInitialState : function() {
    return {
      currentActivityIndex : null,
      activities : {}, // e.g. [{ kind: 'activity', text: 'wash the dishes' , distractions : []}], []
      distractions : [], // just array of strings, e.g. ['check email', 'CNN', 'Daily Mail', 'hacker news']
      finishedActivites : [],
    }
  },
  addActivityToState : function(newActivityText) {
    var timestamp = (new Date()).getTime();
    this.state.activities['activity-' + timestamp] = {
      kind : "activity",
      text : newActivityText,
      isFinished : false,
      distractions : [],
    }
    console.log(this.state.activities);
    this.setState({activities: this.state.activities});

  },
  deleteActivityFromState : function(key) {
    console.log("inside deleteActivityFromState. Key is:");
    console.log(key);
    delete this.state.activities[key];
    this.setState({ activities: this.state.activities });
  },
  addDistractionToState : function(activityIndex, newDistractionText) {
    event.preventDefault();
    // this method is INCOMPLETE
    this.state.activities[activityIndex].distractions.push(newDistractionText);
    this.setState({activities: this.state.activities});
  },
  render : function() {
    var currentActivityIndex = this.state.currentActivityIndex;
    var activities = this.state.activities;
    if (currentActivityIndex !== null) {
      return (
        <div>
          <h1>Distractions:</h1>
          <ListView
            data={activities[currentActivityIndex].distractions.map ( function(x){
              return {
                kind : 'distraction',
                text : x,
              }
            })}
            addToState={ function(newDistractionText) {
              this.addDistractionToState(currentActivityIndex,newDistractionText);
            }.bind(this)}
          />
        </div>
      )
    } else {
      return (
        <div>
          <h1>PomAGoGo</h1>
          <h4>Eliminate distractions. Finish tasks.</h4>
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
    event.preventDefault();
    var inputText = this.refs.inputText.value;
    /*
    var inputText = {
      text : this.refs.inputText.value,
    };
    */
    console.log("inputText:");
    console.log(inputText);
    this.props.addToState(inputText);
    this.refs.addItemForm.reset();
  },
  renderItem : function(item, key) {
    var lexicalThis = this;
    console.log("inside renderItem. item:");
    console.log(item);
    console.log("this.props");
    console.log(this.props);
    //console.log(item[index].text);
    //return (<li key={'listview-' + item.kind + index}>{item.text}</li>) // plus other stuff
    return (
      <li key={key}>
        <span className="activity-text">{item.text}</span>
        <a href="#" onClick={ function() {return}} className="start-pomodoro"> Start </a>
        {/*
        <a href="#" onClick={ function(event) {
            this.props.deleteItem[index];
        }.bind(null,this)} className="delete-link"> x </a>
        */}
        <a href="#" onClick={ function(event, another) {
          console.log('pushed button');
          lexicalThis.props.deleteItem(key);
        }} className="delete-link"> x </a>
      </li>
    ) // plus other stuff
  },
  render : function() {
    return (
      <div>
        <ol className='activities-ol'>
          {Object.keys(this.props.data).map(
            function(key) {
              return this.renderItem(this.props.data[key],key);
            }.bind(this)
          )}
        </ol>
        <form onSubmit={this.createItem} ref="addItemForm" className='form-inline'>
          <input ref="inputText" type='text' placeholder="ex. Play piano" className="form-control"/>
          <button type='submit' className='btn btn-default'>Add</button>
        </form>
      </div>
    )
  },
});

ReactDOM.render(<App/>, document.querySelector(".container"));
