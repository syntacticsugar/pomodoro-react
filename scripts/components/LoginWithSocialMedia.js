import React from 'react';

var LoginWithSocialMedia = React.createClass({
  render : function() {
    var loggedInWith = this.props.loggedInWith;
    var socialMediaDisplayName = this.props.socialMediaDisplayName;
    var authenticate = this.props.authenticate;
    function iconSpecificToSocial(loggedInWith) {
      return "fa fa-2x fa-" + loggedInWith;
    }

    if (!loggedInWith) {
      return (
        <div className="login-with-social-media">
          {/*
          <span>Log in via</span>
            */}
          <ul>
            {/*
            <li><a href="" onClick={function(e) {e.preventDefault(); authenticate('facebook')}}>
                    <i className="fa fa-facebook-square fa-lg"></i></a></li>
            */}
            <li><a href="" onClick={function(e) {e.preventDefault(); authenticate('github')}}>
                    <i className="fa fa-github fa-lg"></i></a></li>
            <li><a href="" onClick={function(e) {e.preventDefault(); authenticate('twitter')}}>
                    <i className="fa fa-twitter fa-lg"></i></a></li>
          </ul>
        </div>
      )
    } else {
      return (
        <div className="login-with-social-media">
          {/*
          {socialMediaDisplayName}, you are logged in via <i className={iconSpecificToSocial(loggedInWith)}></i>{loggedInWith}
          <button className='btn'  onClick={this.props.logout}>Logout</button>
          */}
          {socialMediaDisplayName} via <i className={iconSpecificToSocial(loggedInWith)}></i>
          <button className='social-media-logout'  onClick={this.props.logout}>Logout</button>
        </div>
      )
    }
  }
});

export default LoginWithSocialMedia;
