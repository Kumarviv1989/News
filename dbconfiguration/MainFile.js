import React from "react";
import ImportFileConfig from './Configuration';
import PublishJobs from './PublishJob';
import { Container } from '@material-ui/core';
import PopulateDb from './PopulateDb';
import TextField from "@material-ui/core/TextField";

class MainFile extends React.Component
{
    state={
        message:''
    }

    GetErrorMessage= async (Details)=>{
            await
            this.setState({message:Details})
        }
    
    render(){
        return(
           
            <Container>
                <div>
                <TextField  value={this.state.message}
            style={{ paddingTop: "0px", alignItems:'center', marginLeft: "500px" ,display:'none'}} />
                </div>
                <ImportFileConfig onSubmit={this.GetErrorMessage}/>
                <PublishJobs onSubmit={this.GetErrorMessage}/>
                <PopulateDb onSubmit={this.GetErrorMessage}/>
            </Container>
        );
    }
}
export default  MainFile;