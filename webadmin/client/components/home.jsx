import React from 'react';

export default React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {

    };
  },
  getMeteorData() {
    return {
      user: Meteor.user()
    }
  },
  componentDidMount() {


  },

  render() {
    return (
      <div className="block background">
        <video id="video_background"  loop="loop" autoPlay="autoPlay" preload="auto" onended="this.play()">
          <source type="video/mp4" src="/bg.mp4"></source>
        </video>
        <div className="videogrid">sfgsadhshhrt</div>
      </div>
    );
  }
});
