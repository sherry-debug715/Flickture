import { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';

export default function ControlledCheckbox({handleChange, checked}) {

  return (
    <Checkbox
      checked={checked}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'controlled' }}
      color="success"
    />
  );
}