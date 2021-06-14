import React from 'react';
import Interval from './Interval'
import Name from './Name';
import Button from '@material-ui/core/Button';
import { CircularProgress } from '@material-ui/core';


class Main extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            name: "tseries",
            nameError: false,
            start: null,
            startError: false,
            end: null,
            endError: false,
            startViews: null,
            endViews: null,
            delta: null,
            loaded: false,
            submit: false,
            error: null
        }

        this.setName = this.setName.bind(this)
        this.setStartTime = this.setStartTime.bind(this)
        this.setEndTime = this.setEndTime.bind(this)
        this.request = this.request.bind(this)
        this.validate = this.validate.bind(this)
        this.sleep = this.sleep.bind(this)
        this.clear = this.clear.bind(this)
    }

    setName(name) {
        this.setState({"name": name})
        this.setState({"loaded": false})
    }

    setStartTime(startTime) {
        this.setState({"start": startTime})
        this.setState({"loaded": false})
    }

    setEndTime(endTime) {
        this.setState({"end": endTime})
        this.setState({"loaded": false})
    }

    validate() {
        if(!this.state.name) 
            this.setState({"nameError": true})
        else
            this.setState({"nameError": false})
        
        if(!this.state.name)
            return false;
        return true;
    }

    clear() {
        this.setState({"nameError": false})
        this.setState({"startError": false})
        this.setState({"endError": false})
        this.setState({"error": null})
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    /**
     * This is the core of the logic, we are essentially doing most of the 
     * difficult part on the client side, as a client will need to keep a 
     * session open no matter what, there is no reason to require the server
     * to hold to do a simple delta calculation.
     * 
     * We initially request for the first time. Then we wait for the second 
     * time, sending the request to the server for the number of views. Then
     * we simply set delta to be the difference.
     */
    request() {
        this.clear()
        // Calculate the first sleep //
        if(this.validate()) {
            this.setState({"submit": true})
            var time = (this.state.start.getTime() - new Date().getTime())
            if(time < 0)
                time = 0;
            this.sleep(time).then(() => {
                return fetch(`/youtube/${this.state.name}`)            
            })
            .then(response => {
                if (!response.ok)
                    throw new Error(response)
                return response.json();
            }).then(response => {
                if(response.success)
                    this.setState({"startViews": response.data.numberOfViews})
            }).then(() => {
                time = (this.state.end.getTime() - new Date().getTime())
                if(time < 0)
                    time = 0;
            }).then(() => {
                return this.sleep(time)
            }).then(() => {
                return fetch(`/youtube/${this.state.name}`)            
            }).then(response => {
                if (!response.ok)
                    throw new Error(response.json())
                return response.json();
            }).then(response => {
                if(response.success) {
                    this.setState({"endViews": response.data.numberOfViews})
                    this.setState({"delta": response.data.numberOfViews - this.state.startViews})
                    this.setState({"loaded": true})
                    this.setState({"submit": false})
                }
            })
            .catch(err => {
                this.setState({"error": "That channel name is not valid"})
                this.setState({"nameError": true})
                this.setState({"loaded": false})
            })
        }
    }


    render() {
        
        return(<div className="Main" style={{display: "flex", flexDirection: "column", marginLeft: "20%", marginRight: "20%", marginTop: "20vh"}}>
            {this.state.loaded & !this.state.error ?
                <div style={{textAlign: "center"}}>
                    <p>{this.state.delta} new people watched the newest {this.state.name} video between these times.</p>
                </div> : null
            }

            {!this.state.loaded & this.state.submit & !this.state.error ? 
                <div style={{textAlign: "center"}}>
                    <CircularProgress />
                    <p>Running your request... </p>
                </div> : null
            }

            {this.state.error ? 
                <div style={{textAlign: "center"}}>
                    <p>{this.state.error}</p>
                </div> : null
            }
            <Name setName={this.setName} error={this.state.nameError}/>
            <Interval 
                setStartTime={this.setStartTime} 
                setEndTime={this.setEndTime}
                startTimeError={this.state.startError}
                endTimeError={this.state.endError}
            />
            <div style={{display: "flex", justifyContent: "center", marginTop: "20px"}}>
                <Button variant="contained" color="primary" onClick={this.request}>
                    Request Views
                </Button>
            </div>
        </div>)
    }
}

export default Main;