import 'date-fns';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import TimePicker from '@material-ui/lab/TimePicker';
import Stack from '@material-ui/core/Stack';

export default function Interval(props) {
    // The first commit of Material-UI
    const [startDate, setStartDate] = React.useState(null);
    const [endDate, setEndDate] = React.useState(null);
    const [startError, setStartError] = React.useState(false);
    const [endError, setEndError] = React.useState(false);

    const onStartChange = function(value){
        setStartError(false);
        setStartDate(value);
        props.setStartTime(value);
    }

    const onEndChange = function(value) {
        setEndDate(value);
        props.setEndTime(value);
    }

    React.useEffect(() => {
        if(props.startTimeError)
            setStartError(true)
        if(props.endTimeError)
            setEndError(true)
    }, [props.startTimeError, props.endTimeError]);

    React.useEffect(() => {
        var date = new Date()
        if(!startDate) {
            props.setStartTime(date);
            setStartDate(date)
        }
        if(!endDate) {
            props.setEndTime(new Date(date.getTime() + (1000 * 60 * 2)));
            setEndDate(date.getTime() + (1000 * 60 * 2))
        }
    }, []);


    return (<div style={{display: "flex", flexDirection: "row", justifyContent: "center", margin: "10px"}}>
        <div style={{margin: "10px"}}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
                <TimePicker
                minTime={startDate}
                ampm={false}
                error={startError}
                openTo="hours"
                views={['hours', 'minutes', 'seconds']}
                inputFormat="HH:mm:ss"
                mask="__:__:__"
                label="Start Time"
                value={startDate}
                onChange={(newValue) => {
                    onStartChange(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
                />
            </Stack>
            </LocalizationProvider>
        </div>
        <div style={{margin: "10px"}}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
                <TimePicker
                minTime={new Date()}
                ampm={false}
                error={endError}
                openTo="hours"
                views={['hours', 'minutes', 'seconds']}
                inputFormat="HH:mm:ss"
                mask="__:__:__"
                label="End Time"
                value={endDate}
                onChange={(newValue) => {
                    onEndChange(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
                />
            </Stack>
        </LocalizationProvider>
        </div>
    </div>
  );

}