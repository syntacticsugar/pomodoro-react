import React from 'react';

var FontAwesomeExample = React.createClass({
  render : function() {
    return (
      <div className='font-awesome-wrapper'>
        <div className=''>
          <a className="btn btn-danger" href="#">
          <i className="fa fa-trash-o fa-lg"></i> Delete</a>
          <a className="btn btn-default btn-sm" href="#">
          <i className="fa fa-cog"></i> Settings</a>

          <a className="btn btn-lg btn-success" href="#">
          <i className="fa fa-play fa-2x pull-left"></i> play</a>
          <a className="btn btn-lg btn-success" href="#">
          <i className="fa fa-pause fa-2x pull-left"></i> pause</a>
          <a className="btn btn-lg btn-success" href="#">
          <i className="fa fa-stop fa-2x pull-left"></i> close</a>

          <div className="btn-group">
            <a className="btn btn-default" href="#"><i className="fa fa-align-left"></i></a>
            <a className="btn btn-default" href="#"><i className="fa fa-align-center"></i></a>
            <a className="btn btn-default" href="#"><i className="fa fa-align-right"></i></a>
            <a className="btn btn-default" href="#"><i className="fa fa-align-justify"></i></a>
          </div>

          <div className="input-group margin-bottom-sm">
            <span className="input-group-addon"><i className="fa fa-envelope-o fa-fw"></i></span>
            <input className="form-control" type="text" placeholder="Email address" />
          </div>
          <div className="input-group">
            <span className="input-group-addon"><i className="fa fa-key fa-fw"></i></span>
            <input className="form-control" type="password" placeholder="Password" />
          </div>

          <div className="btn-group open">
            <a className="btn btn-primary" href="#"><i className="fa fa-user fa-fw"></i> User</a>
            <a className="btn btn-primary dropdown-toggle" data-toggle="dropdown" href="#">
              <span className="fa fa-caret-down"></span></a>
            <ul className="dropdown-menu">
              <li><a href="#"><i className="fa fa-pencil fa-fw"></i> Edit</a></li>
              <li><a href="#"><i className="fa fa-trash-o fa-fw"></i> Delete</a></li>
              <li><a href="#"><i className="fa fa-ban fa-fw"></i> Ban</a></li>
              <li className="divider"></li>
              <li><a href="#"><i className="i"></i> Make admin</a></li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
});

export default FontAwesomeExample;
