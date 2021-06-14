import React from 'react';
import TextField from '@material-ui/core/TextField';

export default function Name(props) {

    const [name, setName] = React.useState("tseries");
    const [nameError, setNameError] = React.useState(false);

    const onEventChange = function(e){
        setName(e.target.value);
        props.setName(e.target.value);
    }

    React.useEffect(() => {
        if(props.error)
            setNameError(props.error)
    }, [props.error]);

    return (
        <div style={{display: "flex", flexDirection: "column", marginLeft: "20%", marginRight: "20%", justifyContent: "center"}}>
        <TextField 
            error={nameError}
            id="standard-basic" 
            value={name} 
            onChange={(event) => onEventChange(event)} 
            helperText="Youtuber Name"
        />
        </div>
    );
}