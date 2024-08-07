const { execSync } = require("child_process");
const axios = require("axios");
const { storeDataLocally, logError } = require("./logging.js");

var url = process.env.URL;
const DongelName = process.env.DONGEL_NAME;

function getCameraStatus() {
  try {
    const status = execSync("vcgencmd get_camera").toString();
    return status.includes("supported=1 detected=1") ? "1" : "0";
  } catch (error) {
    return "0";
  }
}

function getTemperature() {
  try {
    const temp = execSync(
      "cat /sys/class/thermal/thermal_zone0/temp"
    ).toString();
    return (parseInt(temp) / 1000).toFixed(1);
  } catch (error) {}
}

function getDongelStatus() {
  try {
    const status = execSync("lsusb").toString();
    return status.includes(DongelName) ? "1" : "0";
  } catch (error) {
    return "0";
  }
}

function cpuVoltage() {
  try {
    const voltage = execSync("vcgencmd measure_volts").toString();
    const match = voltage.match(/[0-9]+\.[0-9]+/);
    return match ? match[0] : "0.0";
  } catch (error) {
    return "0";
  }
}

async function minuteScript()  {
  const cameraStatus = getCameraStatus();
  const temperature = getTemperature();
  const dongelStatus = getDongelStatus();
  const voltage = cpuVoltage();
  const hostName = execSync("hostname").toString().trim();

  const data = {
    cameraStatus,
    temperature,
    dongelStatus,
    voltage,
  };

  try {
    url = `${url}/${hostName}?cameraStatus=${cameraStatus}&temperature=${temperature}&dongelStatus=${dongelStatus}&voltage=${voltage}`;
    const response = await axios.get(url);
    console.log(response.data);
  } catch (error) {
    console.error("Error sending data:", error);

    logError(`Failed to send data: ${error.message}`);

    storeDataLocally(data);
  }
};

module.exports = {minuteScript};