/**
 * Entry point do Web App.
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Teste Baldi')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}