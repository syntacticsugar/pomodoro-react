'use strict'

import React from 'react';

var Done = React.createClass({
  render : function() {
    var doneActivityKeys = this.props.doneActivityKeys;
    var nDone = Object.keys(doneActivityKeys).length;

    if (nDone >= 1) {
      return (
        <div className="row">
          <div className="col-xs-12 col-sm-10 col-md-8 col-lg-6">
            <h2>Done</h2>
            <h4>Props to you, these are things you've finished:</h4>
            <p>{nDone} are finished.</p>
          </div>
        </div>
      )
    } else {
      return (
        <div>Completed tasks will neatly load here.</div>
      )
    }

  }
});

export default Done;
