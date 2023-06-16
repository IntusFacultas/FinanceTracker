import { FieldValues, useController, UseControllerProps } from 'react-hook-form';
import { ReactNode, FunctionComponent, forwardRef } from 'react';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

const DEFAULT_INPUT_FORMAT = 'yyyy-MM-dd';

function DatePickerFactory<TFieldValue extends FieldValues>() {
    interface DatePickerProps extends UseControllerProps<TFieldValue> {
        label: ReactNode;
        disabled?: boolean;
        inputFormat?: string;
        autoFocus?: boolean;
    }
    const DatePicker: FunctionComponent<DatePickerProps> = forwardRef(
        ({ label, inputFormat = DEFAULT_INPUT_FORMAT, ...props }, _) => {
            const {
                field: { onChange, onBlur, value, name, ref },
                fieldState,
            } = useController(props);
            const helperText = `${name}-helper-text`;
            return (
                <FormControl fullWidth sx={{ m: 1 }}>
                    <MobileDatePicker
                        label={label}
                        inputFormat={inputFormat}
                        value={value ?? null}
                        onChange={onChange}
                        ref={ref}
                        renderInput={params => (
                            <TextField
                                {...params}
                                name={name}
                                onBlur={onBlur}
                                error={!!fieldState.error}
                                aria-describedby={!!fieldState.error ? helperText : undefined}
                            />
                        )}
                    />
                    {!!fieldState.error && <FormHelperText id={helperText}>{fieldState.error?.message}</FormHelperText>}
                </FormControl>
            );
        }
    );
    return DatePicker;
}

export default DatePickerFactory;
