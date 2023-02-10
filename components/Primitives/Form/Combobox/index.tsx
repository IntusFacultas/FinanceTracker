import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import type { AutocompleteRenderOptionState, AutocompleteRenderInputParams } from '@mui/material/Autocomplete';
import { useController } from 'react-hook-form';
import { FunctionComponent, HTMLAttributes, ReactNode, useCallback } from 'react';
import type {
    ComboboxInternalOption,
    FactoryConfigurationProps,
    ComboboxInterface,
    OverriddenAutocompleteRenderInputParams,
} from './types';
import {
    defaultIsOptionEqualToValue,
    defaultIsOptionEqualToSearch,
    defaultGenerateNewOptionPrompt,
    createFilterFunction,
    constructOptionsFilterer,
    mapOptionsToInternalOption,
} from './utils';

type OverridenRenderInputFunction = (params: OverriddenAutocompleteRenderInputParams) => ReactNode;
type InternalRenderInputFunction = (params: AutocompleteRenderInputParams) => ReactNode;
const defaultRenderInputFn: OverridenRenderInputFunction = params => <TextField {...params} />;

type RenderInputFactoryFunction = (
    label: string,
    renderFn: OverridenRenderInputFunction
) => InternalRenderInputFunction;

const renderInputFnFactory: RenderInputFactoryFunction = (label, renderFn) => params => renderFn({ ...params, label });

function ComboboxComponentFactory<TOptionType>({
    createNewOption,
    getOptionLabel,
    renderOption,
    isOptionEqualToValue = defaultIsOptionEqualToValue,
    isOptionEqualToSearch = defaultIsOptionEqualToSearch,
    generateNewOptionPrompt = defaultGenerateNewOptionPrompt,
    renderInput = defaultRenderInputFn,
    filterFnConfiguration: _filterFnConfiguration,
    allowMultiple = false,
    disableClearable = false,
    freeSolo = false,
}: FactoryConfigurationProps<TOptionType>) {
    type ExternalInterface = ComboboxInterface<
        TOptionType,
        typeof allowMultiple,
        typeof disableClearable,
        typeof freeSolo
    >;
    type InternalInterface = ComboboxInterface<
        ComboboxInternalOption<TOptionType>,
        typeof allowMultiple,
        typeof disableClearable,
        typeof freeSolo
    >;
    const defaultFilterConfiguration: FactoryConfigurationProps<TOptionType>['filterFnConfiguration'] = {};
    const filterFnConfiguration = _filterFnConfiguration ?? defaultFilterConfiguration;

    const filterFn = createFilterFunction(filterFnConfiguration);

    const _getOptionLabel = (option: string | ComboboxInternalOption<TOptionType>) => {
        if (typeof option === 'string') {
            return option;
        }
        if (typeof option.data === 'string') {
            return option.data;
        }
        return getOptionLabel(option.data);
    };

    const _renderOption = (
        props: HTMLAttributes<HTMLLIElement>,
        option: ComboboxInternalOption<TOptionType>,
        state: AutocompleteRenderOptionState
    ) => {
        if (typeof option.data === 'string') {
            return option.data;
        }
        return renderOption(props, option.data, state);
    };
    const _isOptionEqualToValue = (
        option: ComboboxInternalOption<TOptionType>,
        value: ComboboxInternalOption<TOptionType>
    ) => {
        if (typeof option.data === 'string' || typeof value.data === 'string') {
            return option.data === value.data;
        }
        return isOptionEqualToValue(option.data, value.data);
    };
    const _isOptionEqualToSearch = (option: ComboboxInternalOption<TOptionType>, value: string) => {
        if (typeof option.data === 'string') {
            return option.data.includes(value);
        }
        return isOptionEqualToSearch(option.data, value);
    };

    const filterOptions = constructOptionsFilterer<TOptionType>({
        filterFn,
        generateNewOptionPrompt,
        isOptionEqualToSearch: _isOptionEqualToSearch,
    });

    const Combobox: FunctionComponent<InternalInterface> = ({ options, label, ...props }) => {
        const {
            field: { onChange, onBlur, value, name, ref },
            fieldState,
        } = useController(props);
        const renderInputFn = useCallback(renderInputFnFactory(label, renderInput), [label]);
        return (
            <>
                <Autocomplete
                    value={value as ComboboxInternalOption<TOptionType>}
                    onChange={(_, newValue) => {
                        if (!newValue) {
                            return onChange(null);
                        }
                        if (Array.isArray(newValue)) {
                            const nonStrings = newValue.map(subValue => {
                                if (typeof subValue === 'string') {
                                    return createNewOption(subValue);
                                }
                                return subValue;
                            }) as ComboboxInternalOption<TOptionType>[];
                            return onChange(
                                nonStrings.map(subValue => {
                                    return subValue.data;
                                })
                            );
                        }
                        if (typeof newValue === 'string') {
                            return onChange(createNewOption(newValue));
                        }
                        if (newValue.isSentinel) {
                            return onChange(createNewOption(newValue.data));
                        }
                        return onChange(newValue.data);
                    }}
                    filterOptions={filterOptions}
                    selectOnFocus
                    handleHomeEndKeys
                    id={name}
                    ref={ref}
                    onBlur={onBlur}
                    options={options}
                    getOptionLabel={_getOptionLabel}
                    renderOption={_renderOption}
                    isOptionEqualToValue={_isOptionEqualToValue}
                    sx={{ width: 300 }}
                    freeSolo={freeSolo}
                    multiple={allowMultiple}
                    disableClearable={disableClearable}
                    renderInput={renderInputFn}
                />
                {fieldState.error?.message && <>{fieldState.error.message}</>}
            </>
        );
    };

    const ComboboxExternalInterface: FunctionComponent<ExternalInterface> = ({ options, ...props }) => {
        const internalOptions = mapOptionsToInternalOption(options);
        return <Combobox options={internalOptions} {...props} />;
    };
    return ComboboxExternalInterface;
}

export default ComboboxComponentFactory;
