import { format } from "date-fns";

type Props = {
  dateString?: string;
  date?: Date;
};

const DateFormatter = ({ dateString, date = new Date() }: Props) => {
  if (dateString) {
    date = new Date(dateString);
  }
  return <time dateTime={date.toISOString()}>{format(date, "LLLL	d, yyyy")}</time>;
};

export default DateFormatter;