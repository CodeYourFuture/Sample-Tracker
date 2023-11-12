/** Codewars has a public API; docs here:
 * https://dev.codewars.com/#introduction
 */
const CODEWARSIDS = SpreadsheetApp.getActive()
  .getSheetByName("Trainee Info")
  .getRange("F:F")
  .getValues();
//arggh off by one
CODEWARSIDS.unshift([]);

function batchRank() {
  const rankColumn = SpreadsheetApp.getActive()
    .getSheetByName("Performance")
    .getRange("C:C");
  const rankOfTrainees = CODEWARSIDS.map((userName, rowIndex) =>
    rowIndex > 1 ? [getRank(userName)] : ["CW Rank"]
  );

  rankColumn.setValues(rankOfTrainees);
}
function batchPoints() {
  const rankColumn = SpreadsheetApp.getActive()
    .getSheetByName("Performance")
    .getRange("D:D");
  const rankOfTrainees = CODEWARSIDS.map((userName, rowIndex) =>
    rowIndex > 1 ? [getPoints(userName)] : ["JS Points"]
  );
  // off by one!
  rankColumn.setValues(rankOfTrainees);
}

function getCodewars() {
  batchPoints();
  batchRank();
}

/**
 * Converts Codewars Name to Codewars Rank
 * Available as a formula anywhere, expensive!
 * @param {string} Codewars username .
 * @return {string} API call to Codewars returning Javascript rank
 * @customfunction
 */

function getRank(userName) {
  const endpoint = "https://www.codewars.com/api/v1/users/" + userName;
  try {
    const response = UrlFetchApp.fetch(endpoint);
    const profile = JSON.parse(response.getContentText());
    const rank =
      profile.ranks.languages?.javascript?.name ||
      profile.ranks.overall?.name ||
      9;
    return rank.replace("kyu", "");
  } catch (e) {
    return 9;
  }
}
/**
 * Converts Codewars Name to Codewars Points
 * Available as a formula anywhere, but expensive!
 * @param {string} Codewars username .
 * @return {string} API call to Codewars returning Javascript points
 * @customfunction
 */
function getPoints(userName) {
  const endpoint = "https://www.codewars.com/api/v1/users/" + userName;
  try {
    const response = UrlFetchApp.fetch(endpoint);
    const profile = JSON.parse(response.getContentText());
    return profile.ranks.languages.javascript.score || 0;
  } catch (e) {
    return 0;
  }
}
