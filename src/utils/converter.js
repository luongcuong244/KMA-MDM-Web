const formatMoney = (value) => {
  if (!Number.isInteger(value)) {
    return "Unknown";
  }
  return `${value.toLocaleString("vi-VN")} VNĐ`;
};

function formatCurrency(number) {
  return number.toLocaleString('vi-VN');
}

const formatPath = (removedPath, originalPath) => {
  if (originalPath === removedPath) {
    return "/";
  }
  return originalPath.replace(removedPath, "");
};

const formatDateToPlayedTimeFormation = (timestamp) => {
  const date = new Date(timestamp);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

const convertPlayedTimeFormationToTimestamp = (formattedDate, formattedTime) => {
  try {
    const [day, month, year] = formattedDate.split('-');
    const date = new Date(`${month} ${day}, ${year}`);

    const [hours, minutes, seconds] = formattedTime.split(':');

    if (hours && parseInt(hours) > 23 || (minutes && parseInt(minutes) > 59) || (seconds && parseInt(seconds) > 59)){
      return null;
    }

    if (hours) {
      date.setHours(hours);
    }

    if (minutes) {
      date.setMinutes(minutes);
    }

    if (seconds) {
      date.setSeconds(seconds);
    }

    return date.getTime();
  } catch (error) {
    return null;
  }
}

const convertPlayedTimeToMinutes = (playedTime) => {
  try {
    const [hour, minute] = playedTime.split(':');
    return parseInt(hour) * 60 + parseInt(minute);
  } catch (error) {
    return null;
  }
}

const Converter = {
  formatMoney,
  formatCurrency,
  formatPath,
  formatDateToPlayedTimeFormation,
  convertPlayedTimeFormationToTimestamp,
  convertPlayedTimeToMinutes
};

export default Converter;
