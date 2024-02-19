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
      if (select.countries.length <= 1) {
        store.actions.countries.load();
      }
    },

    onClose: (ids: string[]) => {
      console.log('Выпадашка закрыта:', ids);
    },
  };

  useEffect(() => {
    if (select.country && select.countries.length === 0) {
      store.actions.countries.loadById(select.country);
    }
  }, [select.country]);

  useEffect(() => {
    store.actions.countries.load();
  }, []);

  return (
    <Autocomplete.Root
      // value={['65817be05c295a2ff2fcc5e7', '65817be05c295a2ff2fcc5e9']}
      value={select.country}
      onSelected={(country) => callbacks.onCountrySelected(country._id)}
      options={options.countriesDefault}
      smooth={true}
      onOpen={handlers.onOpen}
      onClose={handlers.onClose}
      disabled={select.countriesLoading || select.waiting}
      placeholder={'Выбор страны'}
      onFirstDropAll={true}
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
