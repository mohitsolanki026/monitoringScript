const {execSync} = require("child_process");
const axios = require("axios");
const { logError, storeDataLocally } = require("./logging");

var url = process.env.URL;

function getInternetSpeed() {
  try {
    const speed = execSync("speedtest --json");
    const {download, upload} = JSON.parse(speed);
    return {download, upload};
  } catch (error) {
    return {download: 0, upload: 0};
  }
}

async function hourScript() {
    const {download, upload} = getInternetSpeed();
    const data = { download, upload };
    try {
      url = `${url}/${hostName}?internetSpeed=${upload}`;
      const response = await axios.get(url);
      console.log(response.data);
    } catch (error) {
      console.error("Error sending data:", error);
  
      logError(`Failed to send data: ${error.message}`);

      storeDataLocally(data);
    }
  };

module.exports = {hourScript};