/**
 * Core EJS app controller
 */

var EJS = {
  $lTimeDisplay : $("#L-Time"),
  $rTimeDisplay : $("#R-Time"),
  $lTable : $("#L-Table"),
  $rTable : $("#R-Table"),
  $lTableTotals : '',
  $rTableTotals : '',

  init: function() {
    //this.newHeatTime('L', '4.04', '0.01', '4.03');
    //this.newHeatTime('R', '3.94', '0.04', '3.90');
  },

  newHeatTime : function(lane, time, pass, perfect) {
    // Add the heat row
    $table = this.getLaneTable(lane);
    var row = '<tr class="heat-row"><td class="time">' + time + '</td>';
    row += '<td class="pass">' + pass + '</td><td class="perfect">' + perfect + '</td></tr>';
    $totals = this.getLaneTableTotals(lane);
    if ($totals.length) {
      $(row).insertBefore($totals);
    }
    else {
      $table.append(row);
    }
  },

  newHeatTotalTime : function(lane, time, pass, perfect) {
    $totals = this.getLaneTableTotals(lane);
    if ($totals.length) {
      $totals.find('td.time').html(time);
      $totals.find('td.pass').html(pass);
      $totals.find('td.perfect').html(perfect);
    }
    else {
      var totalsRow = '<tr class="totals"><td class="time">' + time + '</td>';
      //totalsRow += '<td class="pass">' + pass + '</td><td class="perfect">' + perfect + '</td></tr>';
      $table = this.getLaneTable(lane);
      $table.append(totalsRow);

      if (lane == 'L') {
        this.$lTableTotals = this.$lTable.find('tr.totals');
      }
      else if (lane == 'R') {
        this.$rTableTotals = this.$rTable.find('tr.totals');
      }
    }

    //lane.html(time);
  },

  updateDisplay : function(lane, time) {
    $timerDisplay = this.getLaneTimer(lane);
    var timeParts = time.split('.');
    // Convert to number and pad left with 0 if needed.
    timeParts[0] = Number(timeParts[0]);
    console.log(timeParts[0]);
    if (timeParts[0] > 0 && timeParts[0] < 10 || timeParts[0] == 0) {
      timeParts[0] = "0" + timeParts[0];
    }

    time = timeParts[0] + '<span>.</span>' + timeParts[1];

    $timerDisplay.html(time);
  },

  /**
   * Reset the display
   */
  reset : function() {
    this.$lTimeDisplay.html('00<span>.</span>00');
    this.$rTimeDisplay.html('00<span>.</span>00');
    this.$lTable.find('tbody tr').remove();
    this.$rTable.find('tbody tr').remove();
    this.$lTableTotals = '';
    this.$rTableTotals = '';
  },

  getLaneTimer : function(lane) {
    if (lane == 'L') {
      return this.$lTimeDisplay;
    }
    else if (lane == 'R') {
      return this.$rTimeDisplay;
    }
  },

  getLaneTable : function(lane) {
    if (lane == 'L') {
      return this.$lTable;
    }
    else if (lane == 'R') {
      return this.$rTable;
    }
  },

  getLaneTableTotals : function(lane) {
    if (lane == 'L') {
      return this.$lTableTotals;
    }
    else if (lane == 'R') {
      return this.$rTableTotals;
    }
  }
};

// Initialize Socket
var socket = io.connect('http://' + window.location.hostname);

// New start time
socket.on('receiveNewStartTime', function (data) {
  console.log(data);
  EJS.updateDisplay(data.lane, data.time);
});

// New heat time
socket.on('receiveNewHeatTime', function (data) {
  console.log(data);
  EJS.newHeatTime(data.lane, data.time, data.pass, data.perfect);
  EJS.updateDisplay(data.lane, data.time);
});

// New heat total time
socket.on('receiveHeatTotalTime', function (data) {
  console.log(data);
  EJS.newHeatTotalTime(data.lane, data.time, data.pass, data.perfect);
  EJS.updateDisplay(data.lane, data.time);
});

// Race reset
socket.on('raceReset', function (data) {
  EJS.reset();
});

// Race started
socket.on('raceStart', function (data) {
  console.log('race started');
});

// Race begin
socket.on('raceBegin', function (data) {
  console.log('race begin');
});

// Race finish
socket.on('raceFinish', function (data) {
  console.log('race finished');
});

EJS.init();
