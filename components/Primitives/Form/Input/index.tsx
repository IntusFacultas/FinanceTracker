import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import { useController } from 'react-hook-form';
import type { FieldValues, UseControllerProps } from 'react-hook-form';
import type { FunctionComponent, ReactNode } from 'react';
import FormHelperText from '@mui/material/FormHelperText';

function InputFactory<TFieldValue extends FieldValues>() {
    interface InputProps extends UseControllerProps<TFieldValue> {
        startAdornment?: ReactNode;
        label: ReactNode;
        disabled?: boolean;
        placeholder?: string;
        autoFocus?: boolean;
        type: string;
    }
    const Input: FunctionComponent<InputProps> = ({
        startAdornment,
        type,
        label,
        autoFocus = false,
        disabled = false,
        placeholder,
        ...props
    }) => {
        const {
            field: { onChange, onBlur, value, name, ref },
            fieldState,
        } = useController(props);
        const helperText = `${name}-helper-text`;
        return (
            <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor={name}>{label}</InputLabel>
                <OutlinedInput
                    id={name}
                    name={name}
                    ref={ref}
                    type={type}
                    autoFocus={autoFocus}
                    disabled={disabled}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder={placeholder}
                    startAdornment={startAdornment}
                    label={label}
                    error={!!fieldState.error?.message}
                    aria-describedby={!!fieldState.error ? helperText : undefined}
                />
                {!!fieldState.error && <FormHelperText id={helperText}>{fieldState.error?.message}</FormHelperText>}
            </FormControl>
        );
    };
    return Input;
}

export default InputFactory;
