/** Chart progress over course. Checks itself daily on a time trigger.
 * when today is a milestone
 * then copy current performance per trainee
 * and copy the date as a header
 */

const TIMELINE = SpreadsheetApp.getActive().getSheetByName("Timeline");
const MILESTONEDATES = SpreadsheetApp.getActive()
  .getSheetByName("Milestones")
  .getRange("B2:B11")
  .getValues();
const PERFORMANCE = SpreadsheetApp.getActive()
  .getSheetByName("Performance")
  .getRange("G:G");
const NOW = SpreadsheetApp.getActive()
  .getSheetByName("Milestones")
  .getRange("NOW")
  .getValues();

const isMilestoneDay = () =>
  MILESTONEDATES.some((milestone) => dateToDay(milestone) === dateToDay(NOW));

function snapshotPerformance() {
  let waypoint = TIMELINE.getRange(1, TIMELINE.getLastColumn() + 1);
  let datemark = TIMELINE.getRange(2, TIMELINE.getLastColumn() + 1, 1, 1);
  PERFORMANCE.copyTo(waypoint, { contentsOnly: true });
  datemark.setValue(NOW);
}

const chartProgress = () => (isMilestoneDay() ? snapshotPerformance() : 0);

// optional for creating a chart
function plotTimeline() {
  let reQuant = TIMELINE.getDataRange()
    .getValues()
    .map((row) =>
      row.map((cell) =>
        cell === "Behind Milestone"
          ? 1
          : cell === "At Milestone"
          ? 2
          : cell === "Beyond Milestone"
          ? 3
          : cell
      )
    );
}
