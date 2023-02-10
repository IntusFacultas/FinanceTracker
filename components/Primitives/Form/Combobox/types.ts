import { createFilterOptions } from '@mui/material/Autocomplete';
import type {
    AutocompleteProps,
    AutocompleteRenderOptionState,
    AutocompleteRenderInputParams,
} from '@mui/material/Autocomplete';
import { UseControllerProps } from 'react-hook-form';
import { Writeable } from '../../../../type-utils';
import { HTMLAttributes, ReactNode } from 'react';
import type { CreateFilterOptionsConfig } from '@mui/material';

export type DefinedComboboxInternalOption<TOptionType> = {
    inputValue?: string;
    data: TOptionType;
    isSentinel: false;
};
export type SentinelComboboxInternalOption = {
    inputValue?: never;
    data: string;
    isSentinel: true;
};

export type ComboboxInternalOption<TOptionType> =
    | DefinedComboboxInternalOption<TOptionType>
    | SentinelComboboxInternalOption;

export type ComboboxConfigurationProps<TOptionType> = {
    options: TOptionType[];
};
export type OverriddenAutocompleteRenderInputParams = AutocompleteRenderInputParams & { label: string };
export type FactoryConfigurationProps<TOptionType> = {
    createNewOption: (newValue: string) => TOptionType;
    getOptionLabel: (option: TOptionType) => string;
    renderInput?: (params: OverriddenAutocompleteRenderInputParams) => ReactNode;
    renderOption: (
        props: HTMLAttributes<HTMLLIElement>,
        option: TOptionType,
        state: AutocompleteRenderOptionState
    ) => ReactNode;
    allowMultiple?: boolean;
    disableClearable?: boolean;
    freeSolo?: boolean;
    isOptionEqualToValue?: (option: TOptionType, value: TOptionType) => boolean;
    isOptionEqualToSearch?: (option: TOptionType, value: string) => boolean;
    generateNewOptionPrompt: (inputtedText: string) => string;
    filterFnConfiguration?: CreateFilterOptionsConfig<TOptionType>;
};

export type AutocompleteFilterFn<TOptionType> = ReturnType<typeof createFilterOptions<TOptionType>>;

type RelevantAutocompleteProps<
    TOptionType,
    TAllowMultiple extends boolean | undefined,
    TDisableClearable extends boolean | undefined,
    TFreeSolo extends boolean | undefined
> = Pick<AutocompleteProps<TOptionType, TAllowMultiple, TDisableClearable, TFreeSolo>, ''>;
export type ComboboxInterface<
    TOptionType,
    TAllowMultiple extends boolean | undefined,
    TDisableClearable extends boolean | undefined,
    TFreeSolo extends boolean | undefined
> = UseControllerProps & {
    options: TOptionType[];
    label: string;
} & Writeable<RelevantAutocompleteProps<TOptionType, TAllowMultiple, TDisableClearable, TFreeSolo>>;

export type OptionsFiltererConfiguration<TOptionType> = Required<
    Pick<
        FactoryConfigurationProps<ComboboxInternalOption<TOptionType>>,
        'isOptionEqualToSearch' | 'generateNewOptionPrompt'
    >
> & { filterFn: AutocompleteFilterFn<ComboboxInternalOption<TOptionType>> };
