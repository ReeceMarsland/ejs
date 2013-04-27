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
    // Set the Lane Leg Timer
    $laneTimer = this.getLaneTimer(lane);
    $laneTimer.html(time);

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
      totalsRow += '<td class="pass">' + pass + '</td><td class="perfect">' + perfect + '</td></tr>';
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

  /**
   * Reset the display
   */
  reset : function() {
    this.$lTimeDisplay.html('0.00');
    this.$rTimeDisplay.html('0.00');
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


// /**
//  * functions in the now namespace
//  * that the server can call
//  */
// now.receiveHeatTime = function(lane, time, pass, perfect) {
//   EJS.newHeatTime(lane, time, pass, perfect);
// };

// now.receiveHeatTotalTime = function(lane, time, pass, perfect) {
//   EJS.newHeatTotalTime(lane, time, pass, perfect);
// };

EJS.init();
