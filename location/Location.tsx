import * as React from 'react';
import states from '../states.json';
import Select, { components } from 'react-select';
import { CSSProperties } from '@material-ui/styles';

// TODO: typingss
export class Location extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      location: []
    };
  }

  static getDerivedStateFromProps = (nextProps: any, prevState: any) => {
    if (prevState.location !== nextProps.value) {
      return {
        location: nextProps.value
      };
    }
    return null;
  };
  handleClick(e: any) {
    this.setState({
      location: [e && e.map((e:any)=>(e.value||e.label))]
    });
  }

  render() {
    const { onClick } = this.props;
    const { location } = this.state;
    const s:any = {...states,...{"All India":["All India"]}};
    let d = Object.keys(s).map((i:string)=>{
      return {
      label:i,
      value:i,
      options:[
        ...s[i].map((j:string)=>{
          return {
            label:j.replace("*", ""),
            value:j.replace("*", ""),
            group:i
          }
        })
      ]
    }
  });
  
  const filterOption = ({ label, value }:any, string:any) => {
    // default search
    string = string.toLocaleLowerCase();
    if (label.toLocaleLowerCase().includes(string) || value.toLocaleLowerCase().includes(string)) return true;
  
    //// check if a group as the filter string as label
    const groupOptions = d.filter(group =>
      group.label.toLocaleLowerCase().includes(string)
    );
  
    if (groupOptions) {
      for (const groupOption of groupOptions) {
        // Check if current option is in group
        const option = groupOption.options.find(opt => opt.value === value);
        if (option) {
          return true;
        }
      }
    }
    return false;
  };
  
      const groupStyles:CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        
      };
      const groupHeadingStyles:CSSProperties = {
        fontWeight:'bold',
        fontSize:'80%',
        color:'#000',
        cursor:'pointer',
        ":hover":{
         textDecoration:"underline"
        }        
      };
      const groupBadgeStyles:CSSProperties = {
        backgroundColor: '#EBECF0',
        borderRadius: '2em',
        color: '#172B4D',
        display: 'inline-block',
        fontSize: 12,
        fontWeight: 'normal',
        lineHeight: '1',
        minWidth: 1,
        padding: '0.16666666666667em 0.5em',
        textAlign: 'center'
      };
      
     
      const formatGroupLabel = (data :any)=> (
        <div onClick={(e:any)=>{
          if(this.state.location && this.state.location.filter((i:any)=>i.value == data.value).length){
            return false;
          }else{
            let existing = this.state.location ? [...this.state.location] :[];
            this.handleClick([...existing ,data]); 
           onClick([...existing,data]);
          }
          
        }} style={groupStyles}>
          <span>{data.label}</span>
          <span style={groupBadgeStyles}>{data.options.length}</span>
        </div>
      );
      
    return (<div id="#/properties/location">
     
          Location
          <Select
          formatGroupLabel={formatGroupLabel}
          value={location}
         
          menuPortalTarget={document.body}
          onChange={(e:any,i:any)=>{
            this.handleClick(e); 
            onClick(e);
          }}
          styles={{
            groupHeading: base => ({
              ...base,
              ...groupHeadingStyles
            })
          }}
          filterOption={filterOption}
          ignoreAccents={true}
          options={d}
          inputProps={{
            name: 'age',
            id: 'age-simple',
          }}
          isMulti 
        >
        </Select>
    </div>
    );
  }
}
