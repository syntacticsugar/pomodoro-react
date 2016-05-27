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
const firebaseURL = "https://poma.firebaseio.com/"
var base = Rebase.createClass(firebaseURL);
const firebaseAuthRef = new Firebase(firebaseURL);

var App = React.createClass({
  getInitialState : function() {
    return {
      loggedIn : null,
      activityInput : "",
      activities : {},
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
    //localStorage.setItem('token',authData.token);

    var activitiesPath = 'users/' + uid + '/activities';

    /*
    const activitiesRef = firebaseAuthRef.child(activitiesPath);
    activitiesRef.on('value', (snapshot)=> {
      var data = snapshot.val() || {};
      // claim it as our own if there is no owner already
      if(!data.owner) {
        activitiesRef.set({
          owner : uid,
        });
      }
    */
      if (!this.state.loggedIn) {
        // get existing activities (for un-authenticated user, so we can add them to activities for their account
        var preLoginActivities = this.state.activities;
        var preLoginDone = this.state.done;

        console.log('about to setup sync sync state:');
        var syncActivities = base.syncState('users/' + uid + '/activities', {
          context : this,
          state : 'activities',
        });
        console.log(syncActivities);

        // copy preLogingActivities into new (authenticated) activities
        // (this might overwrite activities, but only if you're using on two devices)
        for (var k in preLoginActivities) {
          this.state.activities[k] = preLoginActivities[k];
        }
        // update our state to reflect the current store owner and user
        this.setState({
          activities: this.state.activities,
          done : this.state.done,
          loggedIn: {
            uid : uid,
            provider : authData.provider,
            socialMediaDisplayName : authData[authData.provider].displayName,
            //rebase: [syncUserData, syncActivities, syncDone],
            rebase: [syncActivities],
          }
        });
      }
    //});
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
    console.log("inside deleteActivity()");
    //delete this.state.activities[index];
    delete this.state.activities[index];
    console.log(this.state.activities);
    console.log(index);
    this.setState({
      //activityInput : "",
      activities : this.state.activities,
    })
    if (this.state.loggedIn) {
      var deleteRef = new Firebase(firebaseURL + 'users/' + this.state.loggedIn.uid + '/activities/' + index);
      deleteRef.remove();
    }
    console.log("after deleteActivity()");
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
        // isRunning is toggled by `pause` button
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
  document.querySelector(".container")
);
