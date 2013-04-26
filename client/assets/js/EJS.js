/**
 * Core EJS app controller
 */

var EJS = {
  $lAppTimeDisplay : $("#L-Time"),
  $rAppTimeDisplay : $("#R-Time"),
  raceStartTime : 0,
  raceStarted : false,
  raceBeginTime : 0,
  raceBegan : false,

  init: function() {
    this.newTime('L', '4.043');
    this.newTime('R', '3.943');
  },

  newTime : function(lane, time) {
    lane = this.getLaneTimer(lane);
    lane.html(time);
  },

  getLaneTimer : function(lane) {
    if (lane == 'L') {
      return this.$lAppTimeDisplay;
    }
    else if (lane == 'R') {
      return this.$rAppTimeDisplay;
    }
  }
};


/**
 * create a function in the now namespace
 * that the server can call
 */
now.receiveTime = function(lane, time) {
  EJS.newTime(lane, time);
};


EJS.init();
