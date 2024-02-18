import { Option, OptionsProps } from "../autocomplete/types";

export type MadeInOption = Option & {code: string}

export type MadeInAutocompleteProps = OptionsProps<MadeInOption>
