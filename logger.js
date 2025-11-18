export function logEvent(text) {
  const entry = `[${new Date().toISOString()}] ${text}`;
  try {
    global.botLogs = global.botLogs || [];
    global.botLogs.push(entry);
    if (global.botLogs.length > 1000) global.botLogs.shift();
  } catch (e) {
    console.log(entry);
  }
  console.log(entry);
}
