import * as React from 'react';
import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import dayjs from 'dayjs';

export default function DatePicker({ setEndDate, setStartDate }: any) {
    const [selectedRange, setSelectedRange] = useState<[Date | null, Date | null]>([null, null]);

    React.useEffect(() => {
        const startDate = selectedRange[0] instanceof dayjs ? formatDate(selectedRange[0]) : '';
        const endDate = selectedRange[1] instanceof dayjs ? formatDate(selectedRange[1]) : '';
        setStartDate(startDate)
        setEndDate(endDate)
    }, [selectedRange]);

    const formatDate = (date: any): string => {
        if (date) {
            return dayjs(date).format('YYYY-MM-DD');
        }
        return '';
    };

    const handleDateChange = (newDate: [Date | null, Date | null]) => {
        setSelectedRange(newDate);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
                value={selectedRange}
                onChange={handleDateChange}
                slots={{ field: SingleInputDateRangeField }}
            />
        </LocalizationProvider>
    );
}