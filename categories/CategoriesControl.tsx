import * as React from 'react';
import {mapDispatchToControlProps, mapStateToControlProps} from '@jsonforms/core';
import {connect} from 'react-redux';
import {Categories} from './Categories';

interface CategoriesControlProps {
  data: any;
  handleChange(path: string, value: any): void;
  path: string
}

const CategoriesControl = ({ data, handleChange, path }: CategoriesControlProps) => {
  return (<Categories value={data && data.map((e: any) => {
     return {
      value: e.value,
      label: e.label
    };
  })} onClick={(ev: any) => {
    handleChange(path, ev && ev.map((e: any) => {
      return {
        value:  e.value,
        label: e.label
      };
    }));
  } } />);
};

export default connect(
  mapStateToControlProps,
  mapDispatchToControlProps,
)(CategoriesControl as any);
