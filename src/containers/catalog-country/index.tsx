import Autocomplete, { TOption } from '@src/components/autocomplete';
import { useCatalogContext } from '../catalog';
import { useEffect, useMemo, useState } from 'react';
import useStore from '@src/hooks/use-store';

function CatalogCountry() {
  const store = useStore();
  const { select, callbacks } = useCatalogContext();
  const [search, setSearch] = useState('');

  const helpers = {
    optionsBuilder: (search: string) => {
      setSearch(search);

      return select.allCountries.filter((option: { _id: string; code: string; title: string }) => {
        return [option.code, option.title].some((val) =>
          val.toLowerCase().includes(search.toLowerCase())
        );
      });
    },
  };

  const options = {
    // По каким странам осуществлять поиск
    countriesDefault: useMemo<TOption[]>(() => {
      return [{ _id: null, code: null, title: 'Все' }, ...select.allCountries];
    }, [select.allCountries]),
    // Какие страны участвуют в отображении
    countriesInAction: useMemo<TOption[]>(() => {
      if (!search) return [{ _id: null, code: null, title: 'Все' }, ...select.allCountries];
      return helpers.optionsBuilder(search);
    }, [search, select.allCountries]),
  };

  const handlers = {
    onOpen: () => {
      if (select.allCountries.length <= 1) {
        store.actions.countries.load();
      }
    },
  };

  const [countries, setCountries] = useState([select.country, '65817be05c295a2ff2fcc5e5']);

  // REMOVE
  useEffect(() => {
    console.log('@', select.country);
    store.actions.countries.load();
  }, []);

  useEffect(() => {
    if (select.country && select.allCountries.length === 0) {
      store.actions.countries.loadById(select.country);
    }
  }, [select.country]);

  // useEffect(() => {
  //   callbacks.onCountrySelected(countries);
  // }, [countries]);
  useEffect(() => {
    setCountries(select.countries);
  }, [select.countries]);

  return (
    <Autocomplete.Root
      value={countries}
      // onSelected={(country) => callbacks.onCountrySelected(country._id)}
      onSelected={(country) => setCountries([...countries, country._id])}
      options={options.countriesDefault}
      smooth={true}
      onOpen={handlers.onOpen}
      onClose={() => callbacks.onCountrySelected(countries)}
      disabled={select.countriesLoading || select.waiting}
    >
      <Autocomplete.Search onChange={helpers.optionsBuilder} placeholder='Поиск' />
      <Autocomplete.List>
        {options.countriesInAction.map((option, index) => (
          <Autocomplete.Option
            key={option._id}
            option={option}
            displayString={(option) => option.title}
            indexForFocus={index} // Для фокуса через стейт
          />
        ))}
      </Autocomplete.List>
    </Autocomplete.Root>
  );
}

export default CatalogCountry;
