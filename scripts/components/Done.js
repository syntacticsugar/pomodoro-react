'use strict'

import React from 'react';

var Done = React.createClass({
  render : function() {
    var done = this.props.done;
    var activities = this.props.activities;

    var nDone = Object.keys(done).length;

    //debugger;
    if (nDone >= 1) {
      return (
        <div className="row done-wrapper">
          <div className="col-xs-12 col-sm-10 col-md-8 col-lg-6">
            <h4><img src="images/completed-header.png" /></h4>
            {/*
            <p>{nDone} are finished.</p>
            */}
            <ol className="done-ol">
              {Object.keys(done).map(
                function(index) {
                  return (
                    <li
                      key={index}
                      index={index}
                      className="animate slideInLeft"
                    >
                      <span>
                        <i className="done-icon fa fa-smile-o fa-fw fa-lg"></i>
                      </span>
                      <span className="done-text">{activities[index].text}</span>
                    </li>
                  )
                }
              )}
            </ol>
          </div>
        </div>
      )
    } else {
      return (
        <div></div>
      )
    }

  }
});

export default Done;
