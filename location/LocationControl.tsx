import * as React from 'react';
import {mapDispatchToControlProps, mapStateToControlProps} from '@jsonforms/core';
import {connect} from 'react-redux';
import {Location} from './Location';

interface LocationControlProps {
  data: any;
  handleChange(path: string, value: any): void;
  path: string
}

const LocationControl = ({ data, handleChange, path }: LocationControlProps) => (
  <Location
    value={data && data.map((e:any)=>{ return {
        value:e.place || e.state,
        label:e.place  || e.state,
        group:e.state
    }})}
    onClick={(ev: any) =>{
    handleChange(path, ev && ev.map((e:any)=>{return {
        place:e.group ? e.value : null,
        state:e.group || e.value
    }}))}}
  />
);

export default connect(
  mapStateToControlProps,
  mapDispatchToControlProps,
)(LocationControl as any);
