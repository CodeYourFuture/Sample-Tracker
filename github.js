/**
 * https://www.benlcollins.com/spreadsheets/slow-google-sheets/#24
 * Github search API returns some pretty useful stuff without hassle
 * https://docs.github.com/en/rest/reference/search
 *
 */

const GITHUBIDS = SpreadsheetApp.getActive()
  .getSheetByName("Trainee Info")
  .getRange("E:E")
  .getValues();
const PRTAB = SpreadsheetApp.getActive().getSheetByName("Pull Reqs");
const REPOSITORIES = SpreadsheetApp.getActive()
  .getSheetByName("Pull Reqs")
  .getDataRange()
  .getValues()[1];

const canGitHubFetch = (sheet, headings, repo) =>
  getRangeByHeading(sheet, headings, repo)
    .getValues()
    .some((cell) => cell[0] === "Pull");

// THIS RUNS ONCE A DAY SEE TIME TRIGGERS
// IF IT'S NOT WORKING TRY CHANGING THE TOGGLE TO PULL ON THE BOTTOM ROW
function batchPRs() {
  REPOSITORIES.forEach((repo, rowIndex) =>
    rowIndex > 0 ? columnPull(PRTAB, repo, rowIndex, GITHUBIDS) : repo
  );
}

function columnPull(sheet, repo, colIndex, authors) {
  let range = getColumnLetterByIndex(sheet, colIndex + 1);
  let columnForWeek = sheet.getRange(`${range}:${range}`);

  if (canGitHubFetch(sheet, REPOSITORIES, repo)) {
    let pullPerTrainee = authors.map((author, rowIndex) => [
      getPull(repo, author[0]),
    ]);
    // get util rows from column and add to remapped array
    pullPerTrainee[0] = [repo];
    pullPerTrainee = [
      columnForWeek.getValues()[0],
      ...pullPerTrainee,
      columnForWeek.getValues().pop(),
    ];
    // we do this per column for speed and also to prevent rate limiting by GH
    columnForWeek.setValues(pullPerTrainee);
  }
}

/**
 * Check for PR against week repo and dev id
 * @param {string} Github ID .
 * @return {string} API call to Github returning total_count of PR
 * @customfunction
 */

function getPull(repo, author) {
  // horrible rate limiting sorry
  Utilities.sleep(6400);
  const endpoint = `https://api.github.com/search/issues?q=is:pr+repo:CodeYourFuture/${repo}/+author:${author}`;
  try {
    const response = UrlFetchApp.fetch(endpoint);
    const pullreq = JSON.parse(response.getContentText());
    return pullreq.total_count > 4 ? 4 : pullreq.total_count; // prs are limited to a maximum of 4 per repo
  } catch (e) {
    return 0;
  }
}
