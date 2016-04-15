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
import LoginWithSocialMedia from './components/LoginWithSocialMedia';

//Firebase setup
var Rebase = require("re-base"); // used for syncing
var Firebase = require("firebase"); // used for auth
var base = Rebase.createClass("https://pomagogo.firebaseio.com/");
const firebaseAuthRef = new Firebase("https://pomagogo.firebaseio.com/");

var App = React.createClass({
  getInitialState : function() {
    return {
      loggedIn : null,
      activityInput : "",
      userData : {
        activities : {},
        //done : []
        done : {},
      },
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




  authenticate : function(provider) {
    console.log("trying to auth with" + provider);
    firebaseAuthRef.authWithOAuthPopup(provider, this.postAuthInstructions);
  },

  logout() {
    firebaseAuthRef.unauth();
    localStorage.removeItem('token');
    for (var i in this.state.loggedIn.rebase) {
      base.removeBinding(this.state.loggedIn.rebase[i]);
    }
    //this.setState({ loggedIn : null, activityInput: "", activities: {}, currentSession: null, done: {} });
    this.setState(this.getInitialState());
  },

  postAuthInstructions(err, authData) {
    if(err) {
      console.err(err);
      return;
    }
    //console.log("Hey, the provider you used is:" + provider);
    console.log("authData variable:");
    console.log(authData);
    var uid = authData.uid;
    // save the login token in the browser
    localStorage.setItem('token',authData.token);

    const activitiesRef = firebaseAuthRef.child('users/' + uid + '/activities');
    activitiesRef.on('value', (snapshot)=> {
      var data = snapshot.val() || {};
      // claim it as our own if there is no owner already
      if(!data.owner) {
        activitiesRef.set({
          owner : uid,
        });
      }
      if (!this.state.loggedIn) {
        // get existing userData (for un-authenticated user, so we can add them to userData for their account
        var preLoginUserData = this.state.userData;

        console.log('about to setup sync sync state:');
        console.log('path = users/' + uid + '/userData');
        var syncUserData = base.syncState('users/' + uid + '/userData', {
          context : this,
          state : 'userData'
        });
        console.log(syncUserData);

        var userData = this.state.userData;
        // copy preLoginUserData into new (authenticated) userData (this might overwrite userData, but it's unlikely)
        for (var k in preLoginUserData) {
          userData[k] = preLoginUserData[k];
        }
        // update our state to reflect the current store owner and user
        this.setState({
          userData: userData,
          loggedIn: {
            uid : uid,
            provider : authData.provider,
            socialMediaDisplayName : authData[authData.provider].displayName,
            rebase: [syncUserData],
          }
        });
      }
    });
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
    this.state.userData.activities['activity-' + timestamp] = activity;
    this.setState({
      activities : this.state.userData.activities,
      activityInput : ""
    });
  },
  deleteActivity : function(index) {
    // prevent refresh
    //event.preventDefault();
    delete this.state.userData.activities[index];
    this.setState({
      activities : this.state.userData.activities,
    })
  },
  updateActivityProperty : function(key,propertyName,value) {
    this.state.userData.activities[key][propertyName] = value;
    this.setState({ activities : this.state.userData.activities });
    //console.log('inside updateActivityProperty in main.js');
  },
  markDoneActivity : function(key) {
    this.state.userData.activities[key].status = "done";
    this.state.userData.activities[key].isFinished = true;
    //this.state.userData.done.push(this.state.userData.activities[key]);
    console.log('try to update "done":');
    console.log(this.state.userData.done);
    console.log(key);
    this.state.userData.done[key] = key;
    console.log(this.state.userData.done);
    this.setState({
      activities : this.state.userData.activities,
      //done : this.state.userData.done,
    });
    this.setState({done : this.state.userData.done});
    //alert("key:" + key);
    //alert(key);
  },

  createAndInitializeNewSession : function(activityKey) {
    this.state.userData.activities[activityKey].status = 'in-progress';

    var timeAtInitialization = Math.floor((new Date().getTime())/1000);

    this.state.currentSession = {
          activity : activityKey,
          name : this.state.userData.activities[activityKey].text,
          isRunning : true,
          initializedAt : timeAtInitialization,
          totalElapsed : 0,
          lastCountedAt : timeAtInitialization,
          singlePomodoroInSeconds : 5,
    };

    this.setState({
      activities : this.state.userData.activities,
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
    this.state.userData.activities[activityKey].status = 'abandoned';
    this.setState({
      activities : this.state.userData.activities,
      currentSession : null,
    });
  },
  completeSession : function() {
    var activityKey = this.state.currentSession.activity;
    //this.state.userData.activities[activityKey].status = 'done';
    //this.state.userData.activities[activityKey].isFinished = true;
    this.markDoneActivity(activityKey);
    this.setState({
      //activities : this.state.userData.activities,
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


  renderMain: function() {
    return (
      <div>
        <header className="row">
          <div className="header-logo col-xs-9">
            <h1 className="logo">
              <img className="logo-title img-responsive" src="images/logo-full.png" />
            </h1>
          </div>
          <div className="header-login col-xs-3">
            <LoginWithSocialMedia
              authenticate={this.authenticate}
              logout={this.logout}
              loggedInWith={this.state.loggedIn ? this.state.loggedIn.provider : null}
              socialMediaDisplayName={this.state.loggedIn ? this.state.loggedIn.socialMediaDisplayName : null}
            />
          </div>
        </header>

        <Activities
            activities = {this.state.userData.activities}
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
            activities={this.state.userData.activities}
            done={this.state.userData.done}
        />
        <br/><br/><br/>
      </div>
    )
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
              activities={this.state.userData.activities}
              markDoneActivity={this.markDoneActivity}
              updateActivityProperty={this.updateActivityProperty}
            />
            {this.renderMain()}
          </div>
        )
      } else {
        return this.renderMain();
    }
  }
});



ReactDOM.render(
  <App />,
  document.querySelector(".container-fluid")
);
