import { format } from "date-fns";

function haveSameDate(timestamp1, timestamp2) {
  if (!timestamp1 || !timestamp2) return false;

  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);

  const day1 = date1.getDate();
  const month1 = date1.getMonth();
  const year1 = date1.getFullYear();

  const day2 = date2.getDate();
  const month2 = date2.getMonth();
  const year2 = date2.getFullYear();

  return day1 === day2 && month1 === month2 && year1 === year2;
}

function formatDate(timestamp, currentTimestamp) {
  const currentDate = new Date(currentTimestamp);
  const date = new Date(timestamp);

  const newCurrentDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffTime = newCurrentDate.getTime() - newDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Hôm nay";
  } else if (diffDays === 1) {
    return "Hôm qua";
  } else if (diffDays === 2) {
    return "Hôm kia";
  } else if (diffDays >= 3 && diffDays <= 7) {
    const daysOfWeek = [
      "Chủ nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ];
    const dayOfWeek = daysOfWeek[date.getDay()];
    return dayOfWeek;
  } else {
    return format(date, "dd/MM/yyyy");
  }
}

function formatTimestampToDateString(timestamp) {
  const date = new Date(timestamp);
  return format(date, "dd/MM/yyyy");
}

function formatTimestampToString(timestamp, pattern) {
  const date = new Date(timestamp);
  return format(date, pattern);
}

const TimeUtils = {
  haveSameDate,
  formatDate,
  formatTimestampToDateString,
  formatTimestampToString,
};

export default TimeUtils;
