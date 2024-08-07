const fs = require("fs");
const path = require("path");

function logError(message) {
  const logFilePath = path.join(__dirname, "error.log");
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;

  fs.appendFileSync(logFilePath, logMessage, (err) => {
    if (err) console.error("Failed to write error log:", err);
  });
}

function storeDataLocally(data) {
    const dataFilePath = path.join(__dirname, 'localData.json');
    
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify([]));
    }
  
    const existingData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  
    existingData.push({
      timestamp: new Date().toISOString(),
      data: data
    });

    fs.writeFileSync(dataFilePath, JSON.stringify(existingData, null, 2));
  }

module.exports = { logError, storeDataLocally };