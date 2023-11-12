/* This is the main script computing performance
 * It's pretty simple - it finds the Milestones which are set by date
 * It compares the value in the milestone to the value each trainee has generated
 * Then it evaluates people as missing, meeting, or exceeding that milestone
 */

const TRAINEES = SpreadsheetApp.getActive()
  .getSheetByName("Performance")
  .getDataRange()
  .getValues();
const MILESTONES = SpreadsheetApp.getActive()
  .getSheetByName("Milestones")
  .getRange("A1:H11")
  .getValues();

const getMilestone = (sheet, column) =>
  sheet.find((row) => row[row.length - 1] === true)[column];
const getProgress = (sheet, row, column) => sheet[row][column];
const checkMilestone = (factor, milestone) =>
  factor > milestone ? 3 : factor === milestone ? 2 : 1;
//codewars goes down, darnit!
const checkCodewars = (factor, milestone) =>
  factor < milestone ? 3 : factor === milestone ? 2 : 1;

function computePerformance(trainees, row, milestones) {
  if (getProgress(trainees, row, 8) === "LEFT") return "Left Course";
  // 1 behind, 2 at, 3 ahead, and there are currently 4 measures
  // therefore at each milestone 8 is the currently the comparator
  const comparator = 8;
  if (row) {
    let attendance = checkMilestone(
      getProgress(trainees, row, 1),
      getMilestone(milestones, 5)
    );
    let codewars = checkCodewars(
      getProgress(trainees, row, 2),
      getMilestone(milestones, 3)
    );
    let codility = checkMilestone(
      getProgress(trainees, row, 4),
      getMilestone(milestones, 4)
    );
    let pulls = checkMilestone(
      getProgress(trainees, row, 5),
      getMilestone(milestones, 6)
    );

    const sumFactors = codewars + codility + attendance + pulls;
    return sumFactors > comparator
      ? "Beyond Milestone"
      : sumFactors === comparator
      ? "At Milestone"
      : "Behind Milestone";
  }
}

function batchPerformance() {
  const performanceColumn = SpreadsheetApp.getActive()
    .getSheetByName("Performance")
    .getRange("G:G");
  const performanceOfTrainees = TRAINEES.map((rowData, rowIndex) =>
    rowIndex > 1
      ? [computePerformance(TRAINEES, rowIndex, MILESTONES)]
      : ["Performance"]
  );
  performanceColumn.setValues(performanceOfTrainees);
}
