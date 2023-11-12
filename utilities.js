/**
 * Resources here to get up to speed with Google Sheets
 *
 * https://www.benlcollins.com/
 * https://developers.google.com/apps-script/guides/sheets
 *
 * This Utilities sheet creates menus and provides triggers and toggles etc
 */

/**
 * Use the onOpen event to run API calls,
 * Toggle stuff
 * And add any functions you need to the custom menu
 *
 */
function onOpen() {
  generateMenu();
}

/**
 * Menu Items ADD ANY YOU NEED
 * https://developers.google.com/apps-script/quickstart/custom-functions#set_it_up
 */
function generateMenu() {
  const ss = SpreadsheetApp.getActive();
  const menuItems = [
    { name: "Get Performance", functionName: "batchPerformance" },
    { name: "Get Pull Reqs", functionName: "batchPRs" },
    { name: "Get Codewars", functionName: "getCodewars" },
    { name: "Get Codility", functionName: "batchCodility" },
  ];
  ss.addMenu("CodeYourFuture", menuItems);
}

/** Just some util functions to navigate with if you don't know sheets (cos I don't!) */
/**
 * Get Range by integer structure is getRange(ROW, COL, NUMROWS, NUMCOLS)
 */
const sortTabByName = (sheet, column) => sheet.sort(column);
const getColumnNumberByHeading = (columns, heading) =>
  columns.indexOf(heading) + 1;
const getColumnLetterByIndex = (sheet, column) =>
  sheet
    .getRange(1, column, 1, 1)
    .getA1Notation()
    .match(/([A-Z]+)/)[0];

const getRangeByHeading = (sheet, headings, key) => {
  let range = getColumnLetterByIndex(
    sheet,
    getColumnNumberByHeading(headings, key)
  );
  return sheet.getRange(`${range}:${range}`);
};
const getDataRangeByHeading = (sheet, headings, key) => {
  let col = getColumnLetterByIndex(
    sheet,
    getColumnNumberByHeading(headings, key)
  );
  let row = sheet.getLastRow();
  return sheet.getRange(`${col}1:${col}${row}`);
};
const getColumnsByPartialMatch = (headings, match) =>
  headings
    .map((col) =>
      col.includes(match) ? getColumnNumberByHeading(headings, col) : 0
    )
    .filter((v) => v !== 0.0);

const dateToDay = (date) =>
  Utilities.formatDate(new Date(date), "UTC", "MMMM-dd-yyyy");
