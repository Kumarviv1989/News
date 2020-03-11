import React from 'react';
import firebase from "firebase/app";
import {logos} from '../firebase';
import FileUploader from "react-firebase-file-uploader";
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";



import ReactDOM from 'react-dom';

class Search1 extends React.Component
{
 
    state={input : '',url : '',firebaseImageUrl : '',progressState: {display: "none"},firebaseURLStyle: {display: "none"}}
      
    onInputChange = (event)=>{
        this.setState({ input: event.target.value });
    }

    onLogopathChange=(event)=>{
            this.setState({ url: event.target.value });
    }
     GetImage= ()=>{
         return new Promise((res,rej)=>{
            var xhr = new XMLHttpRequest();
            
            xhr.responseType = 'blob';
            xhr.onload = function(event) {
                if(xhr.status==200){
                    res(xhr.response);
                }
                else{
                    rej(xhr.status);
                }
            };
            xhr.open('GET', this.state.url);
            //xhr.setRequestHeader("Access-Control-Allow-Origin","*");
            xhr.send();
         })
    }

    MyMethod(){
        alert(this.state.input +  " " + this.state.url)
      // alert(this.state.input);
        console.log(this.state.input);
    }

    // async handleChange(event){
    //     var blob = await this.GetImage();
    //     if(blob){

    //         logos.child("foo").put(blob);
            
    //        // logos.ref(`image/${event.target.files[0].name}`);
    //         console.log(event.target.files[0])
    //     }
    // }

    async handleChange(event){
        this.setState({progressState: {display: "block",margin: "10px"}});
    this.GetImage().then((blob)=>{
            console.log(blob);
            if(blob){

               const uploadTask= logos.child(this.state.input).put(blob);
               uploadTask.on('state_changed',(snapshot)=>{

               },
               (error)=>{
                console.log(error);
                
               } ,
                  ()=>{
                   const resulturl= logos.child(this.state.input).getDownloadURL().then(url=>{
                       console.log(url);
                       this.setState({firebaseImageUrl: url,progressState: {display: "none"},firebaseURLStyle: {display: "block",margin: "10px"}})
                   });
                 //  console.log(resulturl.Promise.value);
                  }
               )
               
               


                
               // logos.ref(`image/${event.target.files[0].name}`);
                //console.log(event.target.files[0])
            }
        })
       
    }

    render()
    {
    return( 
            <Paper> 
                <Typography variant="h5" component="h3" style={{paddingTop: "10px",marginLeft: "10px"}}>
                    Submit Logo URL
                </Typography>
                <Grid container direction="column" justify="center" alignItems="stretch">
                    <TextField label="Company" type="text" size="100" style={{marginTop:'10px',marginLeft:'15px',marginRight: '15px'}}   onChange={this.onInputChange }/>
                    <TextField label="Logo Path" type="text" size="100" style={{marginTop:'20px',marginLeft:'15px',marginRight: '15px'}} onChange={this.onLogopathChange}/>
                <br/>
                </Grid>
                <Grid container direction="column" justify="center" alignItems="flex-start">
                    <Button variant="contained" color="primary" style={{marginLeft: '10px',marginBottom: '10px'}} onClick={()=>{this.handleChange()}}>Submit</Button>
                </Grid>
                <Grid container direction="column" justify="center" alignItems="stretch">
                    <div style={this.state.progressState}><LinearProgress /></div>
                    <div style={this.state.firebaseURLStyle}>Firebase URL: {this.state.firebaseImageUrl}</div>
                </Grid>
            </Paper>
    )}
}

export default Search1;
