import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const DATE_TIME_FORMAT = 'DD-MM-YYYY HH:mm';

const DateTimeConverter = {
  convert: (dateStr) => {
    const utcDateTime = dayjs.utc(dateStr);
    return utcDateTime.tz('Asia/Bangkok').format(DATE_TIME_FORMAT);
  }
}

export default DateTimeConverter;