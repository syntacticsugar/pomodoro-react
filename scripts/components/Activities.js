import React from 'react';

var Activities = React.createClass({
  getInitialState : function() {
    return {
      activityInputIsFocused : false,
      enableAnimations: true,
    }
  },
  setEnableAnimations : function(bool) {
    this.setState({enableAnimations: bool});
  },
  createActivity : function(event) {
    event.preventDefault();

    var activity = {
      text : this.refs.name.value,
      status : 'new',
      isFinished : false,
      distractions : {},
      // forgot what this part is for:
      timesActivityWasCompleted : [],
      submitTime: (new Date().getTime()).toString(),
    };
    this.props.addActivity(activity);
    this.refs.activityForm.reset();
  },
  inputOnFocus : function(event) {
    //this.props.activityInputIsFocused = true;
    this.setState({
      activityInputIsFocused : true
    });
  },
  inputOnBlur : function(event) {
    //this.props.activityInputIsFocused = false;
    this.setState({
      activityInputIsFocused : false
    })
  },
  showPencilIcon : function() {
    if (this.state.activityInputIsFocused === false) {
      return (
          <i className="fa fa-pencil fa-flip-horizontal fa-fw fa-lg"></i>
      )
    } else {
      return (
          <i className="fa fa-thumbs-up fa-flip-horizontal fa-fw fa-lg"></i>
      )
    }
  },
  showHideActivitiesHeader : function() {
    var activities = this.props.activities;
    var newActivitiesQty = Object.keys(activities).filter( (activity) => activities[activity].status !== "done" ).length;

    if (newActivitiesQty > 0) {
      return (
        <div className=""><img src="images/to-do-header.png" /></div>
      )
    }
  },
  renderActivity : function(item,key) {
    //console.log('\n\n\n\n\n\ninside renderActivity');
    if (item.status != 'done') {
      return (
          <li key={key} className={"li-activity-outer-wrapper " +  (this.state.enableAnimations ? "animated slideInLeft" : "")}>
            <span className='li-activity-wrapper'>
              {/*
              <span className="activity-key">key: {key}</span>
              */}
              <span className="activity-start">
                <a
                  href="#"
                  onClick={ () => this.props.createAndInitializeNewSession(key) }
                  className='start-pomodoro'
                >
                  <i className="fa fa-play fa-fw"></i>
                </a>

              </span>
              <span className="activity-text">{item.text} </span>
              <span className="activity-status">({item.status})</span>
              <span className="activity-delete">
                <a href='#' onClick={ function(event) {
                    event.preventDefault();
                    this.props.deleteActivity(key);
                  }.bind(this)
                }>
                  <i className="fa fa-trash-o"></i>
                  delete
                </a>
              </span>
            </span>
          </li>
      )
    }

  },
  render : function() {
    var activities = this.props.activities;
    return (
      <div className="activity-wrapper">
        <div className="submit-activity-wrapper row">
          <form
            ref='activityForm'
            onSubmit={this.createActivity}
            className='form-inline col-xs-12 col-md-6'
          >
            {/*
            <div className="row">
              <div className="input-group col-xs-10 col-sm-10 col-md-6 col-lg-6">
            */}
              <div className="input-group">
                <span className="input-group-addon">
                  {this.showPencilIcon()}
                </span>

                <input
                    ref='name'
                    onChange={this.props.updateActivityInput}
                    onFocus={this.inputOnFocus}
                    onBlur={this.inputOnBlur}
                    value={this.props.activityInput}
                    type="text"
                    className="form-control input-activity"
                />
                <span className="input-group-btn">
                  <button
                    disabled={this.props.activityInput.length===0}
                    className="btn btn-default submit-task"
                    type="submit"
                    ><i className="fa fa-plus fa-fw "></i>
                  </button>
                </span>
            </div>
          </form>
        </div>{/* ./enter-activity-wrapper  */}

        <div className="row">
          {this.showHideActivitiesHeader()}
          <ol className='activities-ol col-xs-12 col-sm-12 col-md-8 col-lg-8'>
            {Object.keys(activities).map(
              function(key) {
                return this.renderActivity(activities[key],key);
              }.bind(this)
            )}
          </ol>
        </div>

      </div>
    )
  },
});


export default Activities;
