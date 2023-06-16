import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Combobox, { createFilterOptions } from '@mui/material/Autocomplete';
import type { FieldValues, UseControllerProps } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { forwardRef } from 'react';
import type { FunctionComponent } from 'react';
import FormHelperText from '@mui/material/FormHelperText';

function AutocompleteFactory<TFieldValue extends FieldValues>() {
    interface AutocompleteProps extends UseControllerProps<TFieldValue> {
        label: string;
        id?: string;
        options: string[];
    }
    type InternalOptionType = {
        text: string;
        value: string;
    };
    const filter = createFilterOptions<InternalOptionType>();

    const Autocomplete: FunctionComponent<AutocompleteProps> = forwardRef(({ label, id, options, ...props }, _) => {
        const {
            field: { onChange, onBlur, value, name, ref },
            fieldState,
        } = useController(props);
        const helperText = `${name}-helper-text`;
        return (
            <FormControl fullWidth sx={{ m: 1 }}>
                <Combobox
                    freeSolo
                    clearOnBlur
                    handleHomeEndKeys
                    selectOnFocus
                    id={id ?? name}
                    onChange={(__, newValue) => {
                        if (!newValue) {
                            return onChange(undefined);
                        }
                        if (typeof newValue === 'string') {
                            return onChange(newValue);
                        }
                        if (Array.isArray(newValue)) {
                            const [_value] = newValue;
                            return onChange(typeof _value === 'string' ? _value : _value.value);
                        }
                        return onChange(newValue.value);
                    }}
                    onBlur={onBlur}
                    value={value ?? ''}
                    options={options.map(option => ({ text: option, value: option }))}
                    filterOptions={(_options, params) => {
                        const filtered = filter(_options, params);
                        const { inputValue } = params;
                        const isExisting = _options.some(option => inputValue === option.text);
                        if (inputValue && !isExisting) {
                            filtered.push({ text: `Add ${inputValue}`, value: inputValue });
                        }
                        return filtered;
                    }}
                    getOptionLabel={option => {
                        if (typeof option === 'string') {
                            return option;
                        }
                        return option.text;
                    }}
                    renderOption={(optionProps, option) => <li {...optionProps}>{option.text}</li>}
                    renderInput={params => (
                        <TextField
                            {...params}
                            ref={ref}
                            error={!!fieldState.error?.message}
                            aria-describedby={!!fieldState.error ? helperText : undefined}
                            label={label}
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                        />
                    )}
                />
                {!!fieldState.error && <FormHelperText id={helperText}>{fieldState.error?.message}</FormHelperText>}
            </FormControl>
        );
    });
    return Autocomplete;
}

export default AutocompleteFactory;
