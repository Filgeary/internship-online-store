import { useEffect, useMemo, useState } from 'react';

import Autocomplete from '@src/components/autocomplete';
import sliceLongString from '@src/utils/slice-long-string';

import useStore from '@src/hooks/use-store';
import { useCatalogContext } from '../catalog';

import { TOption } from '@src/components/autocomplete/types';

function CatalogCountry() {
  const store = useStore();
  const { select, callbacks } = useCatalogContext();
  const [search, setSearch] = useState('');

  const helpers = {
    optionsBuilder: (search: string) => {
      setSearch(search);

      return select.countries.filter((option: { _id: string; code: string; title: string }) => {
        return [option.code, option.title].some((val) =>
          val.toLowerCase().includes(search.toLowerCase())
        );
      });
    },
  };

  const options = {
    // По каким странам осуществлять поиск
    countriesDefault: useMemo<TOption[]>(() => {
      return [{ _id: '', code: '', title: 'Все' }, ...select.countries];
    }, [select.countries]),
    // Какие страны участвуют в отображении
    countriesInAction: useMemo<TOption[]>(() => {
      if (!search) return [{ _id: '', code: '', title: 'Все' }, ...select.countries];
      return helpers.optionsBuilder(search);
    }, [search, select.countries]),
  };

  const handlers = {
    onOpen: () => {
      const countryArray = Array.isArray(select.country) ? select.country : [select.country];

      if (select.countries.length <= countryArray.length) {
        store.actions.countries.load();
      }
    },

    onClose: (ids: string[]) => {
      if (select.country.toString() === ids.toString()) return;

      if (ids.length === 1) {
        callbacks.onCountrySelected(ids[0]);
        return;
      }

      callbacks.onManyCountriesSelected(ids);
    },
  };

  useEffect(() => {
    if (select.country && select.countries.length === 0) {
      if (Array.isArray(select.country)) {
        store.actions.countries.loadManyByIds(select.country);
        return;
      }

      store.actions.countries.loadById(select.country);
    }
  }, [select.country]);

  return (
    <Autocomplete.Root
      value={select.country}
      isMultiple={true}
      onRemoveCodes={callbacks.onManyCountriesSelected}
      options={options.countriesDefault}
      smooth={true}
      onOpen={handlers.onOpen}
      onClose={handlers.onClose}
      disabled={select.countriesLoading || select.waiting}
      placeholder={'Выбор страны'}
      onFirstDropAll={true}
      showActiveCodes={true}
    >
      <Autocomplete.Search onChange={helpers.optionsBuilder} placeholder='Поиск' />
      <Autocomplete.List>
        {options.countriesInAction.map((option) => (
          <Autocomplete.Option
            key={option._id}
            option={option}
            displayString={(option) => sliceLongString(option.title)}
          />
        ))}
      </Autocomplete.List>
    </Autocomplete.Root>
  );
}

export default CatalogCountry;
