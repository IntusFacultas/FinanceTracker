import { createFilterOptions } from '@mui/material';
import type { CreateFilterOptionsConfig, FilterOptionsState } from '@mui/material';
import { ComboboxInternalOption, SentinelComboboxInternalOption, OptionsFiltererConfiguration } from './types';

export const defaultIsOptionEqualToValue = (option1: unknown, option2: unknown) => option1 === option2;
export const defaultIsOptionEqualToSearch = (option: unknown, value: string) => {
    if (typeof option === 'string') {
        return option.includes(value);
    }
    if (typeof option === 'object') {
        return JSON.stringify(option).includes(value);
    }
    return false;
};
export const defaultGenerateNewOptionPrompt = (inputtedText: string) => `Add "${inputtedText}"`;

const createDefaultStringify =
    <TOptionType>() =>
    (option: TOptionType) => {
        return JSON.stringify(option);
    };

export const createFilterFunction = <TOptionType>(configuration: CreateFilterOptionsConfig<TOptionType>) => {
    const { stringify = createDefaultStringify<TOptionType>(), ...config } = configuration;
    return createFilterOptions<ComboboxInternalOption<TOptionType>>({
        ...config,
        stringify: (option: ComboboxInternalOption<TOptionType>) => {
            if (typeof option.data === 'string') {
                return option.data;
            }
            return stringify(option.data);
        },
    });
};

export const mapOptionsToInternalOption = <TOptionType>(options: TOptionType[]) => {
    const filteredInternalOptions: ComboboxInternalOption<TOptionType>[] = options.map(option => ({
        isSentinel: false,
        data: option,
    }));
    return filteredInternalOptions;
};

export const constructOptionsFilterer =
    <TOptionType>({
        filterFn,
        isOptionEqualToSearch,
        generateNewOptionPrompt,
    }: OptionsFiltererConfiguration<TOptionType>) =>
    (
        options: ComboboxInternalOption<TOptionType>[],
        state: FilterOptionsState<ComboboxInternalOption<TOptionType>>
    ): ComboboxInternalOption<TOptionType>[] => {
        const filtered = filterFn(options, state);
        const { inputValue } = state;
        const optionAlreadyExists = filtered.some(
            option => !option.isSentinel && isOptionEqualToSearch(option, inputValue)
        );
        if (inputValue && !optionAlreadyExists) {
            const prompt: SentinelComboboxInternalOption = {
                isSentinel: true,
                data: generateNewOptionPrompt(inputValue),
            };
            filtered.push(prompt);
        }
        return filtered;
    };
