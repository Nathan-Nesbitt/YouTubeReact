import 'date-fns';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import TimePicker from '@material-ui/lab/TimePicker';
import Stack from '@material-ui/core/Stack';

export default function Interval(props) {
    
    const [endDate, setEndDate] = React.useState(null);
    const [endError, setEndError] = React.useState(false);

    const onEndChange = function(value) {
        setEndDate(value);
        props.setEndTime(value);
    }

    React.useEffect(() => {
        if(props.endTimeError)
            setEndError(true)
    }, [props.endTimeError]);

    React.useEffect(() => {
        var date = new Date()
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