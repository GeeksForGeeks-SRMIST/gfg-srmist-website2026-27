/**
 * Saves messages from the website's contact form into a Google Sheet.
 *
 * Setup (one time, from the club's Google account):
 *  1. Create a Google Sheet, e.g. "GfG SRMIST - Contact messages".
 *  2. In the sheet: Extensions > Apps Script. Delete the starter code and paste this whole file. Save.
 *  3. Deploy > New deployment > type "Web app".
 *       Execute as: Me
 *       Who has access: Anyone
 *     Click Deploy, allow the permissions, and copy the Web app URL (ends in /exec).
 *  4. Paste that URL into contactSheetUrl in src/config.js.
 *
 * Each submission adds a row: Time | Name | Email | Subject | Message.
 * After editing this script, use Deploy > Manage deployments > Edit > New version so the same URL picks it up.
 */
const HEADERS = ['Time', 'Name', 'Email', 'Subject', 'Message'];
// Optional: send a copy of every message to this address too (leave '' to switch off)
const NOTIFY_EMAIL = '';

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p.website) return ok();  // honeypot field filled in: a bot

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    const cut = (v, n) => String(v || '').slice(0, n);
    const row = [new Date(), cut(p.name, 200), cut(p.email, 200), cut(p.subject, 100), cut(p.message, 5000)];
    sheet.appendRow(row);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        replyTo: row[2],
        subject: 'Website contact: ' + row[3] + ' from ' + row[1],
        body: row[4] + '\n\n' + row[1] + ' <' + row[2] + '>',
      });
    }
  } finally {
    lock.releaseLock();
  }
  return ok();
}

function ok() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
