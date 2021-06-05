import React from "react";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import Label from "./_defaultLabel";

const DefaultSelect = ({
  value, // empty values - "null" for single and "[]" for multiple
  onChange,
  disabled,
  error,
  label,
  options,
  placeholder,
  row,
  name,
  ...props
}) => {
  return (
    <div>
      {!!label && <Label disabled={disabled}>{label}</Label>}
      <Autocomplete
        options={options}
        value={value}
        getOptionLabel={(option) => option.title}
        onChange={(e, val) => onChange(val)}
        filterSelectedOptions
        disabled={disabled}
        renderInput={(params) => (
          <TextField
            {...params}
            name={name}
            error={!!error}
            helperText={error}
            variant="outlined"
            label={placeholder}
          />
        )}
        {...props}
      />
    </div>
  );
};

export default DefaultSelect;
