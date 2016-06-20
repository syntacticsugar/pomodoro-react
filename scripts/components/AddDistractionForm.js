'use strict'
import React from 'react';
var CSSTransitionGroup = require('react-addons-css-transition-group');

var AddDistractionForm = React.createClass({
  getInitialState : function() {
    return {
      distractionInputIsFocused : false,
      submittedDistraction : [],
    }
  },
  inputOnFocus : function(event) {
    console.log("on focus");
    //this.props.activityInputIsFocused = true;
    this.setState({
      distractionInputIsFocused : true
    });
  },
  inputOnBlur : function(event) {
    //this.props.activityInputIsFocused = false;
    this.setState({
      distractionInputIsFocused : false
    })
  },
  showPencilIcon : function() {
    return (<i className="fa fa-pencil fa-flip-horizontal fa-fw fa-lg"></i>)
    /*
    if (this.state.distractionInputIsFocused === false) {
      return (
          <i className="fa fa-pencil fa-flip-horizontal fa-fw fa-lg"></i>
      )
    } else {
      return (
          <i className="fa fa-thumbs-up fa-flip-horizontal fa-fw fa-lg"></i>
      )
    }
    */
  },
  createDistraction(event) {
    event.preventDefault();
    //console.log("Distractions.createDistraction");
    var distraction = {
      text : this.refs.name.value,
      belongsToActivity : "",
      status : 'new',
      submitTime: (new Date().getTime()).toString(),
    };
    this.props.addDistraction(distraction);
    this.refs.distractionForm.reset();
    // turn on submittedDistraction
    if (this.state.submittedDistraction.length === 0) {
      var now = (new Date()).toTimeString();
      this.state.submittedDistraction = [
        ...this.state.submittedDistraction,
        now
      ];

      this.setState({
        submittedDistraction : this.state.submittedDistraction,
      });
      setTimeout(() => {
        this.state.submittedDistraction = this.state.submittedDistraction.filter((x) => x !== now);
        this.setState({
          submittedDistraction : this.state.submittedDistraction,
        });
      }, 4000);
    }
  },
  renderListOfDistractions : function() {
    var distractions = this.props.distractions;
    var nDistractions = Object.keys(distractions).length;
    if (nDistractions >=1) {
      return (
        <ol>
          <li></li>
        </ol>
      )
    }
  },
  showCheckIcon : function() {
    //console.log(CSSTransitionGroup);
    return (
      <CSSTransitionGroup
        className="just-submitted"
        component="span"
        transitionAppear={true}
        transitionName="just-submitted"
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={1000}
        transitionAppearTimeout={1000}
      >
        {this.state.submittedDistraction.map((k) =>
          <i className="fa fa-check fa-fw fa-lg" key={k}></i>
        )}
      </CSSTransitionGroup>
    )
  },
  render : function() {
    var lexicalThis = this;
    var addDistraction = this.props.addDistraction;
    var distractions = this.props.distractions;
    var nDistractions = Object.keys(distractions).length;
    var distractionInput = this.props.distractionInput;

    return (
      <div className="row add-distraction-form">
        <h3>Distractions</h3>
        <p>Add any distractions or tasks. You can worry about these AFTER you finish your Pomagogo session</p>
        <form
            ref='distractionForm'
            onSubmit={this.createDistraction}
            className='form-inline col-xs-12 col-md-6'
          >
          <div className="input-group">
            <span className="input-group-addon">
              {this.showPencilIcon()}
            </span>

            <input
                ref='name'
                onChange={this.props.updateDistractionInput}
                onFocus={this.inputOnFocus}
                onBlur={this.inputOnBlur}
                value={this.props.distractionInput}
                type="text"
                className="form-control input-activity"
            />
            <span className="input-group-btn">
              <button
                disabled={this.props.distractionInput.length===0}
                className="btn btn-default submit-task"
                onClick={function() {lexicalThis.createDistraction}}
                type="submit"
                ><i className="fa fa-plus fa-fw "></i>
              </button>
            </span>
            {this.showCheckIcon()}
          </div>
        </form>
      </div>  /* ./distractions-wrapper  */
    )
  }
});

/*
var Checkmark = React.createClass({
  render : function() {
    return (
      <div>
        <i className="just-submitted fa fa-check fa-fw fa-lg"></i>
      </div>
    )
  }
});
*/

export default AddDistractionForm;
/*
export default Checkmark;
*/
