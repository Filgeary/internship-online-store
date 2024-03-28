import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.js";
import { useDispatch, useSelector as useSelector$1, Provider } from "react-redux";
import React, { createContext, useState, useMemo, useContext, useEffect, memo, useCallback, useRef } from "react";
import { Link, useNavigate, useLocation, useParams, Routes, Route } from "react-router-dom";
import shallowequal from "shallowequal";
import { cn } from "@bem-react/classname";
import debounce from "lodash.debounce";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";
import Picker from "emoji-picker-react";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
const ServicesContext = React.createContext(null);
const title$1 = "Shop";
const en = {
  title: title$1,
  "menu.main": "Main",
  "menu.chat": "Chat",
  "menu.leaf": "Leaf fall",
  "menu.drawing": "Drawing",
  "basket.title": "Cart",
  "basket.open": "Open",
  "basket.close": "Close",
  "basket.inBasket": "In cart",
  "basket.empty": "empty",
  "basket.total": "Total",
  "basket.unit": "pcs",
  "basket.delete": "Delete",
  "basket.articles": {
    one: "article",
    other: "articles"
  },
  "article.add": "Add",
  "filter.reset": "Reset",
  "auth.title": "Sign In",
  "auth.login": "Login",
  "auth.password": "Password",
  "auth.signIn": "Sign in",
  "session.signIn": "Sign In",
  "session.signOut": "Sign Out"
};
const title = "Магазин";
const ru = {
  title,
  "menu.main": "Главная",
  "menu.chat": "Чат",
  "menu.leaf": "Листопад",
  "menu.drawing": "Рисование",
  "basket.title": "Корзина",
  "basket.open": "Перейти",
  "basket.close": "Закрыть",
  "basket.inBasket": "В корзине",
  "basket.empty": "пусто",
  "basket.total": "Итого",
  "basket.unit": "шт",
  "basket.delete": "Удалить",
  "basket.articles": {
    one: "товар",
    few: "товара",
    many: "товаров",
    other: "товара"
  },
  "article.add": "Добавить",
  "filter.reset": "Сбросить",
  "auth.title": "Вход",
  "auth.login": "Логин",
  "auth.password": "Пароль",
  "auth.signIn": "Войти",
  "session.signIn": "Вход",
  "session.signOut": "Выход"
};
const translations = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  en,
  ru
}, Symbol.toStringTag, { value: "Module" }));
const translate = (lang, text, plural) => {
  let result = translations[lang] && text in translations[lang] ? translations[lang][text] : text;
  if (typeof plural !== "undefined" && typeof result === "object") {
    const key = new Intl.PluralRules(lang).select(plural);
    if (key in result) {
      result = result[key];
    }
  }
  return String(result);
};
const I18nContext = createContext({});
const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState("ru");
  const i18n = useMemo(
    () => ({
      // Код локали
      lang,
      // Функция для смены локали
      setLang,
      // Функция для локализации текстов с замыканием на код языка
      t: (text, number) => translate(lang, text, number)
    }),
    [lang]
  );
  return /* @__PURE__ */ jsx(I18nContext.Provider, { value: i18n, children });
};
function useServices() {
  return useContext(ServicesContext);
}
function useStore() {
  return useServices().store;
}
function useInit(initFunc, depends = [], backForward = false) {
  useEffect(() => {
    initFunc(false);
    if (backForward) {
      window == null ? void 0 : window.addEventListener("popstate", initFunc);
      return () => {
        window == null ? void 0 : window.removeEventListener("popstate", initFunc);
      };
    }
  }, depends);
}
function useTranslate() {
  return useContext(I18nContext);
}
function useSelector(selectorFunc) {
  const store = useStore();
  const [state, setState] = useState(
    () => selectorFunc(store.getState())
  );
  const unsubscribe = useMemo(() => {
    return store.subscribe(() => {
      const newState = selectorFunc(store.getState());
      setState(
        (prevState) => shallowequal(prevState, newState) ? prevState : newState
      );
    });
  }, [store, selectorFunc]);
  useEffect(() => {
    return () => unsubscribe();
  }, [unsubscribe]);
  return state;
}
const Menu = ({ items = [], onNavigate }) => {
  const cn$1 = cn("Menu");
  return /* @__PURE__ */ jsx("ul", { className: cn$1(), children: items.map((item) => /* @__PURE__ */ jsx("li", { className: cn$1("item"), children: /* @__PURE__ */ jsx(Link, { to: item.link, onClick: () => onNavigate(item), children: item.title }) }, item.key)) });
};
const Menu$1 = memo(Menu);
function numberFormat(value, locale = "ru-RU", options = {}) {
  return new Intl.NumberFormat(locale, options).format(value);
}
const BasketTool = ({ sum = 0, amount = 0, onOpen, t }) => {
  const cn$1 = cn("BasketTool");
  return /* @__PURE__ */ jsxs("div", { className: cn$1(), children: [
    /* @__PURE__ */ jsx("span", { className: cn$1("label"), children: t("basket.inBasket") }),
    /* @__PURE__ */ jsx("span", { className: cn$1("total"), children: amount ? `${amount} ${t("basket.articles", amount)} / ${numberFormat(sum)} ₽` : t("basket.empty") }),
    /* @__PURE__ */ jsx("button", { onClick: onOpen, children: t("basket.open") })
  ] });
};
const BasketTool$1 = memo(BasketTool);
const SideLayout = ({ children, side, padding, align }) => {
  const cn$1 = cn("SideLayout");
  return /* @__PURE__ */ jsx("div", { className: cn$1({ side, padding, align }), children: React.Children.map(children, (child, index) => /* @__PURE__ */ jsx("div", { className: cn$1("item"), children: child }, index)) });
};
const SideLayout$1 = memo(SideLayout);
const modalsActions = {
  /**
   * Открытие модалки по названию
   * @param name
   *  @param id
   */
  open: ({ name, id }) => {
    return { type: "modal/open", payload: { name, id } };
  },
  // /**
  //  * Закрытие модалки
  //  * @param name
  //  */
  // close: (names) => {
  //   return {type: 'modal/close', payload: {names}}
  // },
  /**
   * Статус открытости всех модальных окон
   * @param status
   */
  changeActiveModal: (status) => {
    return { type: "modal/active", payload: { status } };
  },
  /**
   * Закрытие модалки
   * @param name  
   */
  closeModal: (id) => (dispatch, getState, services) => {
    const newModals = getState().modals.modals.filter((item) => item.id !== id);
    dispatch({ type: "modal/close", payload: { modals: newModals } });
    if (getState().modals.modals.length < 1)
      getState().modals.activeModal = false;
  },
  /**
  * Статус открытости модального окна с каталогом товара
  * @param status
  */
  changeStatusCatalogModal: (status) => {
    return { type: "modal/status/catalog", payload: { status } };
  }
};
function generateUniqueId() {
  return "_" + Math.random().toString(36).slice(2, 11);
}
function Navigation() {
  const store = useStore();
  const dispatch = useDispatch();
  const select = useSelector((state) => ({
    amount: state.basket.amount,
    sum: state.basket.sum,
    lang: state.locale.lang
  }));
  const id = generateUniqueId();
  const callbacks = {
    // Открытие модалки корзины
    openModalBasket: useCallback(() => {
      dispatch(modalsActions.open({ name: "basket", id }));
      dispatch(modalsActions.changeActiveModal(true));
    }, [store]),
    // Обработка перехода на главную
    onNavigate: useCallback((item) => {
      if (item.key === 1)
        store.actions.catalog.resetParams();
    }, [store])
  };
  const { t } = useTranslate();
  const options = {
    menu: useMemo(() => [
      { key: 1, title: t("menu.main"), link: "/" },
      { key: 2, title: t("menu.chat"), link: "/chat" },
      { key: 3, title: t("menu.leaf"), link: "/leaf" },
      { key: 4, title: t("menu.drawing"), link: "/drawing" }
    ], [t])
  };
  return /* @__PURE__ */ jsxs(SideLayout$1, { side: "between", children: [
    /* @__PURE__ */ jsx(Menu$1, { items: options.menu, onNavigate: callbacks.onNavigate }),
    /* @__PURE__ */ jsx(BasketTool$1, { onOpen: callbacks.openModalBasket, amount: select.amount, sum: select.sum, t })
  ] });
}
const Navigation$1 = memo(Navigation);
const PageLayout = ({ head, footer, children }) => {
  const cn$1 = cn("PageLayout");
  return /* @__PURE__ */ jsxs("div", { className: cn$1(), children: [
    /* @__PURE__ */ jsx("div", { className: cn$1("head"), children: head }),
    /* @__PURE__ */ jsx("div", { className: cn$1("center"), children }),
    /* @__PURE__ */ jsx("div", { className: cn$1("footer"), children: footer })
  ] });
};
const PageLayout$1 = memo(PageLayout);
const Head = ({ title: title2, children }) => {
  return /* @__PURE__ */ jsxs("div", { className: "Head", children: [
    /* @__PURE__ */ jsx("div", { className: "Head-place", children: /* @__PURE__ */ jsx("h1", { children: title2 }) }),
    /* @__PURE__ */ jsx("div", { className: "Head-place", children })
  ] });
};
const Head$1 = memo(Head);
const Select = ({ options, value, onChange }) => {
  const onSelect = (e) => {
    onChange(e.target.value);
  };
  return /* @__PURE__ */ jsx("select", { className: "Select", value, onChange: (e) => onSelect(e), children: options.map((item) => /* @__PURE__ */ jsx("option", { value: item.value, children: item.title }, item.value)) });
};
const Select$1 = memo(Select);
const Input = (props) => {
  const [value, setValue] = useState(props.value);
  const onChangeDebounce = useCallback(
    debounce((value2) => props.onChange(value2, props.name), 600),
    [props.onChange, props.name]
  );
  const onChange = (event) => {
    setValue(event.target.value);
    onChangeDebounce(event.target.value);
  };
  useEffect(() => setValue(props.value), [props.value]);
  const cn$1 = cn("Input");
  return /* @__PURE__ */ jsx(
    "input",
    {
      className: cn$1({ theme: props.theme }),
      value,
      type: props.type,
      placeholder: props.placeholder,
      onChange: (event) => onChange(event)
    }
  );
};
const Input$1 = memo(Input);
function treeToList(tree, callback, level = 0, result = []) {
  var _a;
  for (const item of tree) {
    result.push(callback ? callback(item, level) : item);
    if ((_a = item.children) == null ? void 0 : _a.length)
      treeToList(item.children, callback, level + 1, result);
  }
  return result;
}
function listToTree(list, key = "_id") {
  var _a;
  let trees = {};
  let roots = {};
  for (const item of list) {
    if (!trees[item[key]]) {
      trees[item[key]] = item;
      trees[item[key]].children = [];
      roots[item[key]] = trees[item[key]];
    } else {
      trees[item[key]] = Object.assign(trees[item[key]], item);
    }
    if ((_a = item.parent) == null ? void 0 : _a._id) {
      if (!trees[item.parent._id])
        trees[item.parent[key]] = { children: [] };
      trees[item.parent[key]].children.push(trees[item[key]]);
      if (roots[item[key]])
        delete roots[item[key]];
    }
  }
  return Object.values(roots);
}
const Img$2 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABUSURBVHgB7Yy7DQAgCERJbBzDEdx/CUfREaTQjo+KjYaXXAN3D8D5n0DcMiZimjxd7kHB1DGQZHV0VWaZk2r/LemRjBubZJTULKOkZtkk3ZQ5r9MBwKgaTiegIRIAAAAASUVORK5CYII=";
const SelectLayout = React.forwardRef((props, ref) => {
  const cn$1 = cn("Select-layout");
  const {
    options,
    value,
    statusOpen,
    openOrCloseSelect,
    onCountry,
    setValue,
    setCode,
    input,
    code,
    setSelectedIndex,
    onSelected,
    selectedIndex,
    selected,
    setCodes,
    codes,
    onCodes,
    setValueInput
  } = props;
  const handleClickOption = (id, title2, code2) => {
    setValueInput("");
    console.log("codes.length", codes.length);
    if (codes.length > 0) {
      setValue("Выбранные страны");
    } else {
      setValue(title2);
    }
    setCode(code2);
    const selectedId = selected;
    if (!selectedId.current.includes(id)) {
      selectedId.current = [...selectedId.current, id];
    } else
      selectedId.current = selectedId.current.filter((item) => item !== id);
    onSelected(id);
    onCountry(id);
    if (!codes.includes(code2)) {
      setCodes([...codes, code2]);
    } else {
      const filterCodes = codes.filter((item) => item !== code2);
      setCodes(filterCodes);
    }
  };
  const comparison = (index) => {
    if (index === selectedIndex) {
      return true;
    } else
      return false;
  };
  const getSelected = (id) => {
    const selectedId = selected;
    const status = selectedId.current.includes(id);
    return status;
  };
  return /* @__PURE__ */ jsx("div", { className: cn$1(), children: statusOpen ? /* @__PURE__ */ jsxs("div", { className: cn$1("wrap-list"), children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: cn$1("input", { select: true }),
        onClick: openOrCloseSelect,
        children: [
          /* @__PURE__ */ jsxs("div", { className: cn$1("wrap-span"), children: [
            /* @__PURE__ */ jsx("span", { className: cn$1("code", { select: true }), children: value === "Выбранные страны" ? "" : code }),
            /* @__PURE__ */ jsx("span", { className: cn$1("text"), children: codes.length > 0 ? value + "..." : value })
          ] }),
          /* @__PURE__ */ jsx(
            "img",
            {
              className: cn$1("img"),
              src: Img$2,
              style: statusOpen ? { transform: "rotate(180deg)" } : void 0
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: cn$1("list-codes"), children: codes.length > 1 && codes.map((item) => /* @__PURE__ */ jsx("span", { className: cn$1("code-text"), onClick: () => onCodes(item), children: item }, item)) }),
    /* @__PURE__ */ jsx("div", { className: cn$1("wrap-input"), children: input() }),
    /* @__PURE__ */ jsx("div", { className: cn$1("wrap-ul"), children: /* @__PURE__ */ jsx("ul", { className: cn$1("list"), ref, children: options.map((item, index) => /* @__PURE__ */ jsxs(
      "li",
      {
        id: String(index),
        className: cn$1("item", { hover: comparison(index) && !getSelected(item._id), selected: getSelected(item._id) }),
        value: item.title,
        onClick: () => handleClickOption(item._id, item.title, item.code),
        children: [
          /* @__PURE__ */ jsx("span", { className: cn$1("code"), children: item.code }),
          /* @__PURE__ */ jsx("span", { className: cn$1("text"), children: item.title })
        ]
      },
      item._id
    )) }) })
  ] }) : /* @__PURE__ */ jsxs("div", { className: cn$1("input"), onClick: openOrCloseSelect, children: [
    /* @__PURE__ */ jsxs("div", { className: cn$1("wrap-span"), children: [
      /* @__PURE__ */ jsx("span", { className: cn$1("code", { select: true }), children: value === "Выбранные страны" ? "" : code }),
      /* @__PURE__ */ jsx("span", { className: cn$1("text"), children: codes.length > 0 ? value + "..." : value })
    ] }),
    /* @__PURE__ */ jsx("img", { className: cn$1("img"), src: Img$2 })
  ] }) });
});
const SelectLayout$1 = memo(SelectLayout);
function useSelectCustom(countries, isOpen) {
  const store = useStore();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const selectorRef = useRef(null);
  const selected = useRef([]);
  let index = 0;
  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp" && index > 0) {
      --index;
      setSelectedIndex(index);
      scrollSelectedItem("up");
    }
    if (e.key === "ArrowDown" && index !== countries.length - 1) {
      ++index;
      setSelectedIndex(index);
      if (index > 3)
        scrollSelectedItem("down");
    }
    if (e.key === "Enter") {
      let list = selectorRef.current;
      if (list !== null) {
        const id = countries[index]._id;
        const selectedId = selected;
        const selectedElement = document.getElementById(String(index));
        if (!selectedId.current.includes(id)) {
          selectedId.current = [...selectedId.current, id];
          if (selectedElement) {
            selectedElement.style.backgroundColor = "#808DFF";
            selectedElement.style.borderBottom = "1px solid #eaeaec";
          }
        } else {
          selectedId.current = selectedId.current.filter((item) => item !== id);
          if (selectedElement) {
            selectedElement.style.backgroundColor = "#FFFFFF";
            selectedElement.style.borderBottom = "1px solid #FFFFFF";
          }
        }
        const params = selectedId.current.join("|");
        store.actions.catalog.setParams({ madeIn: params, page: 1 }, false, false);
      }
    }
  };
  const scrollSelectedItem = (direction) => {
    const list = selectorRef.current;
    const padding = 5;
    if (list !== null) {
      const selectedItem = list.querySelector(".Select-layout-item");
      if (!selectedItem) {
        return;
      }
      const selectorRect = list.getBoundingClientRect();
      const selectedItemRect = selectedItem.getBoundingClientRect();
      if (direction === "up" && selectedItemRect.top < selectorRect.top + 10) {
        list.scrollTop -= selectedItemRect.height;
      }
      if (direction === "down") {
        if (selectedItemRect.top === selectorRect.top + padding) {
          list.scrollTop += selectedItemRect.height;
        } else {
          if (index !== countries.length - 1) {
            list.scrollTop += selectedItemRect.height;
          }
        }
      }
    }
  };
  const handleMouseEnter = () => {
    setSelectedIndex(null);
  };
  useEffect(() => {
    if (isOpen && countries.length > 0) {
      document.addEventListener("keydown", handleKeyDown);
    }
    const countriesCurrent = selectorRef.current;
    const countriesRef = countriesCurrent;
    countriesRef && countriesRef.addEventListener("mouseenter", handleMouseEnter);
  }, [isOpen]);
  return { selectedIndex, selectorRef, setSelectedIndex, handleKeyDown, handleMouseEnter };
}
function SelectCustom() {
  const store = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("Все");
  const [valueInput, setValueInput] = useState("");
  const [code, setCode] = useState("  ");
  const [codes, setCodes] = useState([]);
  const selected = useRef([]);
  const select = useSelector((state) => ({
    countries: state.countries.list,
    waiting: state.countries.waiting
  }));
  const { selectedIndex, selectorRef, setSelectedIndex, handleKeyDown, handleMouseEnter } = useSelectCustom(
    select.countries,
    isOpen
  );
  const callbacks = {
    // Поиск
    onSearch: useCallback(
      (query) => {
        setValueInput(query);
        setCodes([]);
        const selectedId = selected;
        selectedId.current = [];
        if (query === "все") {
          store.actions.countries.load();
        } else
          store.actions.countries.search(query);
      },
      [store]
    ),
    // Фильтр по странам
    onCountry: useCallback(
      (_id) => {
        const selectedId = selected;
        const params = selectedId.current.join("|");
        store.actions.catalog.setParams({ madeIn: params, page: 1 }, false, false);
      },
      [store]
    ),
    // Выбор страны
    onSelected: useCallback((id) => store.actions.countries.selectСountry(id), [store]),
    // Перемещение скролла 
    onCodes: useCallback((code2) => {
      if (selectorRef.current) {
        const countriesCurrent = selectorRef.current;
        const countriesRef = countriesCurrent;
        const liElements = countriesRef.querySelectorAll(".Select-layout-code");
        liElements.forEach((li) => {
          if (li.textContent === code2) {
            li.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        });
      }
    }, [codes]),
    // Во время открытия и закрытия списка стран
    onSelect: useCallback(() => {
      setIsOpen(!isOpen);
      if (isOpen) {
        document.body.style.overflow = "visible";
      }
      if (!isOpen) {
        document.body.style.overflow = "hidden";
        document.removeEventListener("keydown", handleKeyDown);
        const countriesCurrent = selectorRef.current;
        const countriesRef = countriesCurrent;
        countriesRef && countriesRef.removeEventListener("mouseenter", handleMouseEnter);
      }
    }, [isOpen])
  };
  const renders = {
    input: useCallback(
      () => /* @__PURE__ */ jsx(
        Input$1,
        {
          value: valueInput,
          onChange: callbacks.onSearch,
          placeholder: "Поиск",
          theme: "transparent"
        }
      ),
      [store, setValueInput, valueInput]
    )
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    SelectLayout$1,
    {
      openOrCloseSelect: callbacks.onSelect,
      onSelected: callbacks.onSelected,
      onCountry: callbacks.onCountry,
      value,
      options: select.countries,
      statusOpen: isOpen,
      input: renders.input,
      code,
      setValue,
      setValueInput,
      setCode,
      codes,
      setCodes,
      setSelectedIndex,
      selectedIndex,
      ref: selectorRef,
      selected,
      onCodes: callbacks.onCodes
    }
  ) });
}
const SelectCustom$1 = memo(SelectCustom);
const Button = ({ value, onClick = () => {
}, closeStyle = false }) => {
  const cn$1 = cn("Button");
  return /* @__PURE__ */ jsx("button", { className: cn$1({ close: closeStyle }), onClick, children: value });
};
const Button$1 = memo(Button);
const CatalogFilterContent = ({ sort, query, category, onSort, onSearch, onReset, onCategory, options, t }) => {
  return /* @__PURE__ */ jsxs(SideLayout$1, { padding: "medium", align: "start", children: [
    /* @__PURE__ */ jsx(SelectCustom$1, {}),
    /* @__PURE__ */ jsx(Select$1, { options: options.categories, value: category, onChange: onCategory }),
    /* @__PURE__ */ jsx(Select$1, { options: options.sort, value: sort, onChange: onSort }),
    /* @__PURE__ */ jsx(Input$1, { value: query, onChange: onSearch, placeholder: "Поиск", delay: 1e3 }),
    /* @__PURE__ */ jsx(Button$1, { value: t("filter.reset"), closeStyle: true, onClick: onReset })
  ] });
};
function withCatalogFilter(WrappedComponent, params) {
  const { stateSelector, actionSetParams, actionResetParams, hideParams } = params;
  return function CatalogFilterHOC() {
    const store = useStore();
    const select = useSelector(stateSelector);
    const callbacks = {
      onSort: useCallback((sort) => store.actions[actionSetParams].setParams({ sort }, false, hideParams), [store, actionSetParams]),
      onSearch: useCallback((query) => store.actions[actionSetParams].setParams({ query, page: 1 }, false, hideParams), [store, actionSetParams]),
      onReset: useCallback(() => store.actions[actionResetParams].resetParams(), [store, actionResetParams]),
      onCategory: useCallback((category) => store.actions[actionSetParams].setParams({ category, page: 1 }, false, hideParams), [store, actionSetParams])
    };
    const options = useMemo(() => ({
      sort: [
        { value: "order", title: "По порядку" },
        { value: "title.ru", title: "По именованию" },
        { value: "-price", title: "Сначала дорогие" },
        { value: "edition", title: "Древние" }
      ],
      categories: [
        { value: "", title: "Все" },
        ...treeToList(listToTree(select.categories), (item, level) => ({ value: item._id, title: "- ".repeat(level) + item.title }))
      ]
    }), [select.categories]);
    const { t } = useTranslate();
    return /* @__PURE__ */ jsx(WrappedComponent, { ...select, ...callbacks, options, t });
  };
}
const CatalogFilter = withCatalogFilter(CatalogFilterContent, {
  stateSelector: (state) => ({
    sort: state.catalog.params.sort,
    query: state.catalog.params.query,
    category: state.catalog.params.category,
    categories: state.categories.list
  }),
  actionSetParams: "catalog",
  actionResetParams: "catalog",
  hideParams: false
});
const CatalogFilterForModal = withCatalogFilter(CatalogFilterContent, {
  stateSelector: (state) => ({
    sort: state.catalog_modal.params.sort,
    query: state.catalog_modal.params.query,
    category: state.catalog_modal.params.category,
    categories: state.categories.list
  }),
  actionSetParams: "catalog_modal",
  actionResetParams: "catalog_modal",
  hideParams: true
});
const Item = ({
  item,
  link,
  onOpenModal,
  labelCurr = "₽",
  labelAdd = "Добавить",
  hideLink = true,
  handleClickButton,
  disabled = false
}) => {
  const cn$1 = cn("Item");
  const callbacks = {
    onOpenModal: (event) => {
      event.stopPropagation();
      onOpenModal(item._id);
    },
    handleClick: (event) => {
      event.stopPropagation();
      handleClickButton(item._id);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: cn$1({ selected: item.selectedGoods }), onClick: (event) => callbacks.handleClick(event), children: [
    /* @__PURE__ */ jsx("div", { className: cn$1("title"), children: hideLink ? /* @__PURE__ */ jsx(Link, { to: link || "", children: item.title }) : /* @__PURE__ */ jsx("span", { children: item.title }) }),
    /* @__PURE__ */ jsxs("div", { className: cn$1("actions"), children: [
      /* @__PURE__ */ jsxs("div", { className: cn$1("price"), children: [
        numberFormat(item.price),
        " ",
        labelCurr
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: (event) => callbacks.onOpenModal(event), disabled, children: labelAdd })
    ] })
  ] });
};
const Item$1 = memo(Item);
const List = ({ list, renderItem }) => {
  return /* @__PURE__ */ jsx("div", { className: "List", children: list.map(
    (item) => /* @__PURE__ */ jsx("div", { className: "List-item", children: renderItem(item) }, item._id)
  ) });
};
const List$1 = memo(List);
const Pagination = ({
  page = 1,
  limit = 10,
  count = 1e3,
  indent = 1,
  onChange,
  makeLink
}) => {
  const length = Math.ceil(count / Math.max(limit, 1));
  let left = Math.max(page - indent, 1);
  let right = Math.min(left + indent * 2, length);
  left = Math.max(right - indent * 2, 1);
  let items = [];
  if (left > 1)
    items.push(1);
  if (left > 2)
    items.push(null);
  for (let page2 = left; page2 <= right; page2++)
    items.push(page2);
  if (right < length - 1)
    items.push(null);
  if (right < length)
    items.push(length);
  const onClickHandler = (number, e) => {
    if (onChange) {
      e.preventDefault();
      onChange(number);
    }
  };
  const cn$1 = cn("Pagination");
  return /* @__PURE__ */ jsx("ul", { className: cn$1(), children: items.map((number, index) => /* @__PURE__ */ jsx(
    "li",
    {
      className: cn$1("item", { active: number === page, split: !number }),
      onClick: (e) => onClickHandler(number, e),
      children: number ? makeLink ? /* @__PURE__ */ jsx("a", { href: makeLink(number), children: number }) : number : "..."
    },
    index
  )) });
};
const Pagination$1 = memo(Pagination);
const Spinner = ({ active, children }) => {
  if (active) {
    return /* @__PURE__ */ jsx("div", { className: "Spinner", children });
  } else {
    return children;
  }
};
const Spinner$1 = memo(Spinner);
function CatalogList({ stateName }) {
  const store = useStore();
  const dispatch = useDispatch();
  const selectRef = useRef();
  const [chosenProductId, setChosenProductId] = useState(null);
  const select = useSelector((state) => ({
    list: state[stateName].list,
    page: state[stateName].params.page,
    limit: state[stateName].params.limit,
    count: state[stateName].count,
    waiting: state[stateName].waiting,
    quantity: state.basket.quantity,
    selected: state.basket.selected
  }));
  const idModal = generateUniqueId();
  const callbacks = {
    // Открытие модалки
    openModal: useCallback((id) => {
      dispatch(modalsActions.open({ name: "quantity", id: idModal }));
      dispatch(modalsActions.changeActiveModal(true));
      setChosenProductId(id);
    }, [store]),
    // Добавление в корзину
    addToBasket: useCallback((_id, quantity) => {
      store.actions.basket.addToBasket(_id, quantity);
    }, [store]),
    // Пагинация
    onPaginate: useCallback((page) => store.actions[stateName].setParams({ page }, false, false, selectRef.current), [store]),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback((page) => {
      return `?${new URLSearchParams({ page, limit: select.limit, sort: select.sort, query: select.query })}`;
    }, [select.limit, select.sort, select.query]),
    // Выделения продукта
    changeSelected: useCallback((id) => {
      const status = selectRef.current.some((item) => item.id === id);
      if (status) {
        store.actions.basket.removeFromSelected(id);
        store.actions.catalog_modal.selectItem(id);
      } else {
        store.actions.basket.updateQuantityProduct(1);
        store.actions.basket.updateSelected(id);
        store.actions.catalog_modal.selectItem(id);
      }
    }, [select.selected])
  };
  const { t } = useTranslate();
  useEffect(() => {
    if (select.quantity && chosenProductId)
      callbacks.addToBasket(chosenProductId, select.quantity);
  }, [select.quantity]);
  useEffect(() => {
    if (stateName === "catalog_modal")
      selectRef.current = select.selected;
  }, [select.selected]);
  const renders = {
    item: useCallback((item) => /* @__PURE__ */ jsx(
      Item$1,
      {
        item,
        onOpenModal: callbacks.openModal,
        link: `/articles/${item._id}`,
        labelAdd: t("article.add"),
        disabled: stateName === "catalog_modal" ? "disabled" : "",
        handleClickButton: stateName === "catalog_modal" ? callbacks.changeSelected : () => {
        },
        hideLink: stateName === "catalog_modal" ? false : true
      }
    ), [callbacks.openModal, t, callbacks.changeSelected])
  };
  return /* @__PURE__ */ jsxs(Spinner$1, { active: select.waiting, children: [
    /* @__PURE__ */ jsx(List$1, { list: select.list, renderItem: renders.item }),
    /* @__PURE__ */ jsx(
      Pagination$1,
      {
        count: select.count,
        page: select.page,
        limit: select.limit,
        onChange: callbacks.onPaginate,
        makeLink: callbacks.makePaginatorLink
      }
    )
  ] });
}
const CatalogList$1 = memo(CatalogList);
function LocaleSelect() {
  const { lang, setLang } = useTranslate();
  const options = {
    lang: useMemo(() => [
      { value: "ru", title: "Русский" },
      { value: "en", title: "English" }
    ], [])
  };
  return /* @__PURE__ */ jsx(Select$1, { onChange: setLang, value: lang, options: options.lang });
}
const LocaleSelect$1 = memo(LocaleSelect);
function TopHead() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const store = useStore();
  const select = useSelector((state) => ({
    user: state.session.user,
    exists: state.session.exists
  }));
  const callbacks = {
    // Переход к авторизации
    onSignIn: useCallback(() => {
      navigate("/login", { state: { back: location.pathname } });
    }, [location.pathname]),
    // Отмена авторизации
    onSignOut: useCallback(() => {
      store.actions.session.signOut();
    }, [])
  };
  return /* @__PURE__ */ jsxs(SideLayout$1, { side: "end", padding: "small", children: [
    select.exists ? /* @__PURE__ */ jsx(Link, { to: "/profile", children: select.user.profile.name }) : "",
    select.exists ? /* @__PURE__ */ jsx("button", { onClick: callbacks.onSignOut, children: t("session.signOut") }) : /* @__PURE__ */ jsx("button", { onClick: callbacks.onSignIn, children: t("session.signIn") })
  ] });
}
const TopHead$1 = memo(TopHead);
function Main() {
  const store = useStore();
  useInit(async () => {
    await Promise.all([
      store.actions.catalog.initParams(),
      store.actions.categories.load(),
      store.actions.countries.load()
    ]);
  }, [], true);
  const { t } = useTranslate();
  return /* @__PURE__ */ jsxs(PageLayout$1, { children: [
    /* @__PURE__ */ jsx(TopHead$1, {}),
    /* @__PURE__ */ jsx(Head$1, { title: t("title"), children: /* @__PURE__ */ jsx(LocaleSelect$1, {}) }),
    /* @__PURE__ */ jsx(Navigation$1, {}),
    /* @__PURE__ */ jsx(CatalogFilter, {}),
    /* @__PURE__ */ jsx(CatalogList$1, { stateName: "catalog" })
  ] });
}
const Main$1 = memo(Main);
const ArticleCard = ({ article, onAdd, t }) => {
  var _a, _b, _c;
  const cn$1 = cn("ArticleCard");
  return /* @__PURE__ */ jsxs("div", { className: cn$1(), children: [
    /* @__PURE__ */ jsx("div", { className: cn$1("description"), children: article.description }),
    /* @__PURE__ */ jsxs("div", { className: cn$1("prop"), children: [
      /* @__PURE__ */ jsx("div", { className: cn$1("label"), children: "Страна производитель:" }),
      /* @__PURE__ */ jsxs("div", { className: cn$1("value"), children: [
        (_a = article.madeIn) == null ? void 0 : _a.title,
        " (",
        (_b = article.madeIn) == null ? void 0 : _b.code,
        ")"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: cn$1("prop"), children: [
      /* @__PURE__ */ jsx("div", { className: cn$1("label"), children: "Категория:" }),
      /* @__PURE__ */ jsx("div", { className: cn$1("value"), children: (_c = article.category) == null ? void 0 : _c.title })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: cn$1("prop"), children: [
      /* @__PURE__ */ jsx("div", { className: cn$1("label"), children: "Год выпуска:" }),
      /* @__PURE__ */ jsx("div", { className: cn$1("value"), children: article.edition })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: cn$1("prop", { size: "big" }), children: [
      /* @__PURE__ */ jsx("div", { className: cn$1("label"), children: "Цена:" }),
      /* @__PURE__ */ jsxs("div", { className: cn$1("value"), children: [
        numberFormat(article.price),
        " ₽"
      ] })
    ] }),
    /* @__PURE__ */ jsx("button", { onClick: () => onAdd(article._id), children: t("article.add") })
  ] });
};
const ArticleCard$1 = memo(ArticleCard);
const articleActions = {
  /**
   * Загрузка товара
   * @param id
   * @return {Function}
   */
  load: (id) => {
    return async (dispatch, getState, services) => {
      dispatch({ type: "article/load-start" });
      try {
        const res = await services.api.request({
          url: `/api/v1/articles/${id}?fields=*,madeIn(title,code),category(title)`
        });
        dispatch({ type: "article/load-success", payload: { data: res.data.result } });
      } catch (e) {
        dispatch({ type: "article/load-error" });
      }
    };
  }
};
function Article() {
  const store = useStore();
  const dispatch = useDispatch();
  const params = useParams();
  useInit(() => {
    dispatch(articleActions.load(params.id));
  }, [params.id]);
  const select = useSelector$1((state) => ({
    article: state.article.data,
    waiting: state.article.waiting
  }), shallowequal);
  const { t } = useTranslate();
  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback((_id) => store.actions.basket.addToBasket(_id), [store])
  };
  return /* @__PURE__ */ jsxs(PageLayout$1, { children: [
    /* @__PURE__ */ jsx(TopHead$1, {}),
    /* @__PURE__ */ jsx(Head$1, { title: select.article.title, children: /* @__PURE__ */ jsx(LocaleSelect$1, {}) }),
    /* @__PURE__ */ jsx(Navigation$1, {}),
    /* @__PURE__ */ jsx(Spinner$1, { active: select.waiting, children: /* @__PURE__ */ jsx(ArticleCard$1, { article: select.article, onAdd: callbacks.addToBasket, t }) })
  ] });
}
const Article$1 = memo(Article);
const Field = ({ label, error, children }) => {
  const cn$1 = cn("Field");
  return /* @__PURE__ */ jsxs("div", { className: cn$1(), children: [
    /* @__PURE__ */ jsx("label", { className: cn$1("label"), children: label }),
    /* @__PURE__ */ jsx("div", { className: cn$1("input"), children }),
    /* @__PURE__ */ jsx("div", { className: cn$1("error"), children: error })
  ] });
};
const Field$1 = memo(Field);
function Login() {
  var _a, _b, _c;
  const { t } = useTranslate();
  const location = useLocation();
  const navigate = useNavigate();
  const store = useStore();
  useInit(() => {
    store.actions.session.resetErrors();
  });
  const select = useSelector((state) => ({
    waiting: state.session.waiting,
    errors: state.session.errors
  }));
  const [data, setData] = useState({
    login: "",
    password: ""
  });
  const callbacks = {
    // Колбэк на ввод в элементах формы
    onChange: useCallback((value, name) => {
      setData((prevData) => ({ ...prevData, [name]: value }));
    }, []),
    // Отправка данных формы для авторизации
    onSubmit: useCallback((e) => {
      e.preventDefault();
      store.actions.session.signIn(data, () => {
        var _a2, _b2, _c2;
        const back = ((_a2 = location.state) == null ? void 0 : _a2.back) && ((_b2 = location.state) == null ? void 0 : _b2.back) !== location.pathname ? (_c2 = location.state) == null ? void 0 : _c2.back : "/";
        navigate(back);
      });
    }, [data, location.state])
  };
  return /* @__PURE__ */ jsxs(PageLayout$1, { children: [
    /* @__PURE__ */ jsx(TopHead$1, {}),
    /* @__PURE__ */ jsx(Head$1, { title: t("title"), children: /* @__PURE__ */ jsx(LocaleSelect$1, {}) }),
    /* @__PURE__ */ jsx(Navigation$1, {}),
    /* @__PURE__ */ jsx(SideLayout$1, { padding: "medium", children: /* @__PURE__ */ jsxs("form", { onSubmit: callbacks.onSubmit, children: [
      /* @__PURE__ */ jsx("h2", { children: t("auth.title") }),
      /* @__PURE__ */ jsx(Field$1, { label: t("auth.login"), error: (_a = select.errors) == null ? void 0 : _a.login, children: /* @__PURE__ */ jsx(Input$1, { name: "login", value: data.login, onChange: callbacks.onChange }) }),
      /* @__PURE__ */ jsx(Field$1, { label: t("auth.password"), error: (_b = select.errors) == null ? void 0 : _b.password, children: /* @__PURE__ */ jsx(
        Input$1,
        {
          name: "password",
          type: "password",
          value: data.password,
          onChange: callbacks.onChange
        }
      ) }),
      /* @__PURE__ */ jsx(Field$1, { error: (_c = select.errors) == null ? void 0 : _c.other }),
      /* @__PURE__ */ jsx(Field$1, { children: /* @__PURE__ */ jsx("button", { type: "submit", children: t("auth.signIn") }) })
    ] }) })
  ] });
}
const Login$1 = memo(Login);
const ProfileCard = ({ data }) => {
  var _a, _b;
  const cn$1 = cn("ProfileCard");
  return /* @__PURE__ */ jsxs("div", { className: cn$1(), children: [
    /* @__PURE__ */ jsx("h3", { className: cn$1("title"), children: "Профиль" }),
    /* @__PURE__ */ jsxs("div", { className: cn$1("prop"), children: [
      /* @__PURE__ */ jsx("div", { className: cn$1("label"), children: "Имя:" }),
      /* @__PURE__ */ jsx("div", { className: cn$1("value"), children: (_a = data == null ? void 0 : data.profile) == null ? void 0 : _a.name })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: cn$1("prop"), children: [
      /* @__PURE__ */ jsx("div", { className: cn$1("label"), children: "Телефон:" }),
      /* @__PURE__ */ jsx("div", { className: cn$1("value"), children: (_b = data == null ? void 0 : data.profile) == null ? void 0 : _b.phone })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: cn$1("prop"), children: [
      /* @__PURE__ */ jsx("div", { className: cn$1("label"), children: "email:" }),
      /* @__PURE__ */ jsx("div", { className: cn$1("value"), children: data == null ? void 0 : data.email })
    ] })
  ] });
};
const ProfileCard$1 = memo(ProfileCard);
function Profile() {
  const store = useStore();
  useInit(() => {
    store.actions.profile.load();
  }, []);
  const select = useSelector((state) => ({
    profile: state.profile.data,
    waiting: state.profile.waiting
  }));
  const { t } = useTranslate();
  return /* @__PURE__ */ jsxs(PageLayout$1, { children: [
    /* @__PURE__ */ jsx(TopHead$1, {}),
    /* @__PURE__ */ jsx(Head$1, { title: t("title"), children: /* @__PURE__ */ jsx(LocaleSelect$1, {}) }),
    /* @__PURE__ */ jsx(Navigation$1, {}),
    /* @__PURE__ */ jsx(Spinner$1, { active: select.waiting, children: /* @__PURE__ */ jsx(ProfileCard$1, { data: select.profile }) })
  ] });
}
const Profile$1 = memo(Profile);
function Protected({ children, redirect }) {
  const select = useSelector((state) => ({
    exists: state.session.exists,
    waiting: state.session.waiting
  }));
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!select.exists && !select.waiting) {
      navigate(redirect, { state: { back: location.pathname } });
    }
  }, [select.exists, select.waiting]);
  if (!select.exists || select.waiting) {
    return /* @__PURE__ */ jsx("div", { children: "Ждём..." });
  } else {
    return children;
  }
}
Protected.propTypes = {
  redirect: PropTypes.string,
  children: PropTypes.node
};
const Protected$1 = memo(Protected);
const ItemBasket = ({
  item,
  link,
  onLink,
  onRemove,
  labelCurr = "₽",
  labelDelete = "Удалить",
  labelUnit = "шт"
}) => {
  const cn$1 = cn("ItemBasket");
  const callbacks = {
    onRemove: () => onRemove(item._id)
  };
  return /* @__PURE__ */ jsxs("div", { className: cn$1(), children: [
    /* @__PURE__ */ jsx("div", { className: cn$1("title"), children: link ? /* @__PURE__ */ jsx(Link, { to: link, onClick: onLink, children: item.title }) : item.title }),
    /* @__PURE__ */ jsxs("div", { className: cn$1("right"), children: [
      /* @__PURE__ */ jsxs("div", { className: cn$1("cell"), children: [
        numberFormat(item.price),
        " ",
        labelCurr
      ] }),
      /* @__PURE__ */ jsxs("div", { className: cn$1("cell"), children: [
        numberFormat(item.amount || 0),
        " ",
        labelUnit
      ] }),
      /* @__PURE__ */ jsx("div", { className: cn$1("cell"), children: /* @__PURE__ */ jsx("button", { onClick: callbacks.onRemove, children: labelDelete }) })
    ] })
  ] });
};
const ItemBasket$1 = memo(ItemBasket);
const ModalLayout = ({
  title: title2 = "Модалка",
  onClose,
  children,
  labelClose = "Закрыть",
  hideButton = true
}) => {
  const cn$1 = cn("ModalLayout");
  const layout = useRef(null);
  const frame = useRef(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (layout.current && frame.current) {
        layout.current.style.alignItems = layout.current.clientHeight < frame.current.clientHeight ? "flex-start" : "center";
        layout.current.style.justifyContent = layout.current.clientWidth < frame.current.clientWidth ? "flex-start" : "center";
      }
    });
    if (layout.current) {
      resizeObserver.observe(layout.current);
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
      resizeObserver.disconnect();
    };
  }, []);
  return /* @__PURE__ */ jsx("div", { className: cn$1(), ref: layout, children: /* @__PURE__ */ jsxs("div", { className: cn$1("frame"), ref: frame, children: [
    /* @__PURE__ */ jsxs("div", { className: cn$1("head"), children: [
      /* @__PURE__ */ jsx("h1", { className: cn$1("title"), children: title2 }),
      hideButton && /* @__PURE__ */ jsx("button", { className: cn$1("close"), onClick: onClose, children: labelClose })
    ] }),
    /* @__PURE__ */ jsx("div", { className: cn$1("content"), children })
  ] }) });
};
const ModalLayout$1 = memo(ModalLayout);
const BasketTotal = ({ sum = 0, t }) => {
  const cn$1 = cn("BasketTotal");
  return /* @__PURE__ */ jsxs("div", { className: cn$1(), children: [
    /* @__PURE__ */ jsx("span", { className: cn$1("cell"), children: t("basket.total") }),
    /* @__PURE__ */ jsxs("span", { className: cn$1("cell"), children: [
      " ",
      numberFormat(sum),
      " ₽"
    ] }),
    /* @__PURE__ */ jsx("span", { className: cn$1("cell") })
  ] });
};
const BasketTotal$1 = memo(BasketTotal);
function closeId(modals, name) {
  const modal = modals.find((item) => item.name === name);
  return modal.id;
}
function Basket() {
  const store = useStore();
  const dispatch = useDispatch();
  const select = useSelector((state) => ({
    list: state.basket.list,
    amount: state.basket.amount,
    sum: state.basket.sum,
    selected: state.basket.selected
  }));
  const statusCatalogModal = useSelector$1((state) => state.modals.statusCatalogModal);
  const stateModal = useSelector$1((state) => state.modals.modals);
  const id = generateUniqueId();
  const callbacks = {
    // Удаление из корзины
    removeFromBasket: useCallback((id2) => store.actions.basket.removeFromBasket(id2), [store]),
    // Закрытие модалки
    closeModal: useCallback(() => {
      dispatch(modalsActions.closeModal(closeId(stateModal, "basket")));
    }, [store]),
    // Открытие модалки для выбра товаров
    openModal: useCallback(() => {
      dispatch(modalsActions.open({ name: "goods", id }));
    }, [store])
  };
  const { t } = useTranslate();
  const renders = {
    itemBasket: useCallback((item) => /* @__PURE__ */ jsx(
      ItemBasket$1,
      {
        item,
        link: `/articles/${item._id}`,
        onRemove: callbacks.removeFromBasket,
        onLink: callbacks.closeModal,
        labelUnit: t("basket.unit"),
        labelDelete: t("basket.delete")
      }
    ), [callbacks.removeFromBasket, t])
  };
  useEffect(() => {
    if (statusCatalogModal) {
      store.actions.basket.addingSelectedProducts();
    }
    dispatch(modalsActions.changeStatusCatalogModal(null));
  }, [statusCatalogModal]);
  return /* @__PURE__ */ jsxs(
    ModalLayout$1,
    {
      title: t("basket.title"),
      labelClose: t("basket.close"),
      onClose: callbacks.closeModal,
      children: [
        /* @__PURE__ */ jsx(List$1, { list: select.list, renderItem: renders.itemBasket }),
        /* @__PURE__ */ jsx(BasketTotal$1, { sum: select.sum, t }),
        /* @__PURE__ */ jsx(Button$1, { value: "Выбрать ещё товар", onClick: callbacks.openModal })
      ]
    }
  );
}
const Basket$1 = memo(Basket);
const GoodsQuantityLayout = ({ children, handleCancelClick, handleAddClick }) => {
  const cn$1 = cn("Goods-quantity");
  return /* @__PURE__ */ jsxs("div", { className: cn$1(), children: [
    /* @__PURE__ */ jsxs("div", { className: cn$1("wrap-input"), children: [
      /* @__PURE__ */ jsx("label", { className: cn$1("label"), children: "Количество товара" }),
      /* @__PURE__ */ jsx("div", { className: cn$1("input"), children })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: cn$1("wrap-button"), children: [
      /* @__PURE__ */ jsx("button", { className: cn$1("button"), onClick: handleCancelClick, children: "Отмена" }),
      /* @__PURE__ */ jsx("button", { className: cn$1("button"), onClick: handleAddClick, children: " Ок" })
    ] })
  ] });
};
const GoodsQuantityLayout$1 = memo(GoodsQuantityLayout);
function GoodsQuantity() {
  const store = useStore();
  const dispatch = useDispatch();
  const quantityGoodsRef = useRef(null);
  const stateModal = useSelector$1((state) => state.modals.modals);
  const callbacks = {
    handleCancel: useCallback(() => {
      dispatch(modalsActions.closeModal(closeId(stateModal, "quantity")));
    }, [store]),
    handleAdd: useCallback(() => {
      store.actions.basket.updateQuantityProduct(Number(quantityGoodsRef.current));
      dispatch(modalsActions.closeModal(closeId(stateModal, "quantity")));
    }, [store]),
    onChange: useCallback((value) => {
      quantityGoodsRef.current = value;
    }, [store])
  };
  const { t } = useTranslate();
  return /* @__PURE__ */ jsx(
    ModalLayout$1,
    {
      title: "",
      labelClose: t("basket.close"),
      onClose: callbacks.closeModal,
      hideButton: false,
      children: /* @__PURE__ */ jsx(GoodsQuantityLayout$1, { handleCancelClick: callbacks.handleCancel, handleAddClick: callbacks.handleAdd, children: /* @__PURE__ */ jsx(
        Input$1,
        {
          value: "",
          name: "quantity",
          type: "number",
          placeholder: "",
          onChange: callbacks.onChange,
          theme: ""
        }
      ) })
    }
  );
}
const GoodsQuantity$1 = memo(GoodsQuantity);
function Goods() {
  const store = useStore();
  const dispatch = useDispatch();
  const stateModal = useSelector$1((state) => state.modals.modals);
  const callbacks = {
    closeModal: useCallback(() => {
      dispatch(modalsActions.closeModal(closeId(stateModal, "goods")));
      dispatch(modalsActions.changeStatusCatalogModal(true));
    }, [store])
  };
  useInit(() => {
    store.actions.catalog_modal.initParams();
  }, [], true);
  const { t } = useTranslate();
  return /* @__PURE__ */ jsxs(
    ModalLayout$1,
    {
      title: "",
      labelClose: t("basket.close"),
      onClose: callbacks.closeModal,
      children: [
        /* @__PURE__ */ jsx(CatalogFilterForModal, {}),
        /* @__PURE__ */ jsx(CatalogList$1, { stateName: "catalog_modal" })
      ]
    }
  );
}
const Goods$1 = memo(Goods);
function Modals() {
  const namesModal = useSelector$1((state) => state.modals.modals);
  return /* @__PURE__ */ jsx(Fragment, { children: namesModal.map((item, index) => /* @__PURE__ */ jsxs("div", { children: [
    item.name === "basket" && /* @__PURE__ */ jsx(Basket$1, {}),
    item.name === "quantity" && /* @__PURE__ */ jsx(GoodsQuantity$1, {}),
    item.name === "goods" && /* @__PURE__ */ jsx(Goods$1, {})
  ] }, index)) });
}
const Modals$1 = memo(Modals);
const Img$1 = "/assets/avatar-BckORpDV.png";
const ChatButton = ({
  onLastMessage,
  clearChat,
  onNewMessage
}) => {
  const cn$1 = cn("Buttons");
  return /* @__PURE__ */ jsxs("div", { className: cn$1("wrap-button"), children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        className: cn$1("button", { button_bottom: true }),
        onClick: onLastMessage,
        children: "Старые сообщения"
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: cn$1("button", { button_bottom: true }),
        onClick: clearChat,
        children: "Очистить чат"
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: cn$1("button", { button_bottom: true }),
        onClick: onNewMessage,
        children: "Новые сообщения"
      }
    )
  ] });
};
const ChatButton$1 = memo(ChatButton);
const MessageCheck = () => {
  const cn$1 = cn("Message");
  return /* @__PURE__ */ jsxs("div", { className: cn$1("wrap-check"), children: [
    /* @__PURE__ */ jsxs("div", { className: cn$1("wrap_1"), children: [
      /* @__PURE__ */ jsx("span", { id: "check-part-1", className: cn$1("check") }),
      /* @__PURE__ */ jsx("span", { id: "check-part-2", className: cn$1("check") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: cn$1("wrap_2"), children: [
      /* @__PURE__ */ jsx("span", { id: "check-part-1", className: cn$1("check") }),
      /* @__PURE__ */ jsx("span", { id: "check-part-2", className: cn$1("check") })
    ] })
  ] });
};
const MessageCheck$1 = memo(MessageCheck);
function getTimeFromDate(dateString) {
  let dateObject = new Date(dateString);
  let time = dateObject.toTimeString().split(" ")[0];
  return time;
}
const ChatLayout = React.forwardRef((props, ref) => {
  const {
    onMessage,
    onLastMessage,
    onNewMessage,
    clearChat,
    textarea,
    font,
    setFontOpen,
    connected,
    isfontOpen,
    messages,
    name,
    statusClearChat
  } = props;
  const cn$1 = cn("Chat");
  return /* @__PURE__ */ jsxs("div", { className: cn$1(), children: [
    statusClearChat && /* @__PURE__ */ jsx("p", { className: cn$1("title"), children: "Сообщения удалены" }),
    messages.length < 1 && /* @__PURE__ */ jsx("p", { className: cn$1("title"), children: "Время ожидания сообщений" }),
    messages == null ? void 0 : messages.map((item) => /* @__PURE__ */ jsx(
      "div",
      {
        className: cn$1("wrap-message", { right: item.author.username === name }),
        ref,
        children: /* @__PURE__ */ jsxs("div", { className: cn$1("message"), children: [
          /* @__PURE__ */ jsx("img", { className: cn$1("img"), src: Img$1, alt: "Avatar" }),
          /* @__PURE__ */ jsx("p", { className: cn$1("time"), children: getTimeFromDate(item.dateCreate) }),
          /* @__PURE__ */ jsx("p", { className: cn$1("name"), children: item.author.username }),
          /* @__PURE__ */ jsx("div", { className: cn$1("text"), dangerouslySetInnerHTML: { __html: DOMPurify.sanitize(item.text) } }),
          /* @__PURE__ */ jsx(MessageCheck$1, {})
        ] })
      },
      item._id
    )),
    /* @__PURE__ */ jsxs("div", { className: cn$1("input"), children: [
      /* @__PURE__ */ jsx("button", { className: cn$1("font"), onClick: () => setFontOpen((prev) => !prev), children: "шрифт" }),
      isfontOpen && font(),
      textarea(),
      /* @__PURE__ */ jsx("div", { children: connected && /* @__PURE__ */ jsx("button", { className: cn$1("button"), onClick: onMessage, children: "Отправить" }) })
    ] }),
    /* @__PURE__ */ jsx(
      ChatButton$1,
      {
        onLastMessage,
        clearChat,
        onNewMessage
      }
    )
  ] });
});
const ChatLayout$1 = memo(ChatLayout);
const Img = "/assets/smail-B42C2mvS.png";
const Textarea = React.forwardRef(
  ({ placeholder, value, isBold, addMessage, adjustTextareaHeight }, ref) => {
    const cn$1 = cn("Textarea");
    const [message, setMessage] = useState(value);
    const [showPicker, setShowPicker] = useState(false);
    const handleChange = (event) => {
      setMessage(event.target.value);
      onChangeDebounce(event.target.value);
      adjustTextareaHeight();
    };
    const onChangeDebounce = useCallback(
      debounce((value2) => addMessage(value2, "message"), 600),
      [addMessage, value]
    );
    const onEmojiClick = (emojiObject) => {
      console.log("emojiObject.emoji", emojiObject.emoji);
      setMessage((prev) => prev + emojiObject.emoji);
      onChangeDebounce(message + emojiObject.emoji);
    };
    useEffect(() => {
      showPicker && (window == null ? void 0 : window.scrollTo(0, document.body.scrollHeight));
    }, [showPicker]);
    useEffect(() => setMessage(value), [value]);
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      showPicker && /* @__PURE__ */ jsx(
        Picker,
        {
          lazyLoadEmojis: true,
          onEmojiClick,
          autoFocusSearch: true
        }
      ),
      /* @__PURE__ */ jsx(
        "img",
        {
          className: cn$1("emoji-icon"),
          src: Img,
          onClick: () => setShowPicker((val) => !val)
        }
      ),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          className: cn$1({ bold: isBold }),
          ref,
          value: message,
          onChange: handleChange,
          placeholder,
          onClick: () => setShowPicker(false)
        }
      )
    ] });
  }
);
const Textarea$1 = memo(Textarea);
const MessageFont = ({ onClickBold, onClickNormal }) => {
  const cn$1 = cn("Font");
  return /* @__PURE__ */ jsxs("ul", { className: cn$1(), children: [
    /* @__PURE__ */ jsx("li", { className: cn$1("normal"), onClick: onClickNormal, children: "Нормальный" }),
    /* @__PURE__ */ jsx("li", { className: cn$1("bold"), onClick: onClickBold, children: "Жирный" })
  ] });
};
const MessageFont$1 = memo(MessageFont);
const Chat = () => {
  const { t } = useTranslate();
  const store = useStore();
  const lastMessageRef = useRef();
  const textareaRef = useRef(null);
  const [isBold, setIsBold] = useState(false);
  const [fontOpen, setFontOpen] = useState(false);
  const select = useSelector((state) => ({
    messages: state.chat.messages,
    message: state.chat.message,
    name: state.session.user,
    statusClearChat: state.chat.statusClearChat,
    connected: state.chat.connected
  }));
  const callbacks = {
    // Отправка сообщения
    onMessage: useCallback(() => {
      store.actions.chat.newMessage();
      store.actions.chat.deleteMessage();
      resetTextareaHeight();
    }, [store]),
    // Сохранение сообщения
    onChange: useCallback((value, name) => {
      store.actions.chat.setMessage(value);
    }, [store]),
    // Запрос старых сообщений
    onLastMessage: useCallback(() => {
      store.actions.chat.requestOldMessage();
    }, [store]),
    // Запрос новых сообщений
    onNewMessage: useCallback(() => {
      store.actions.chat.requestLatestMessages();
    }, [store]),
    // Очистить чат
    clearChat: useCallback(() => {
      store.actions.chat.deleteAllMessages();
    }, [store]),
    // Регулирование высоты textarea
    adjustTextareaHeight: useCallback(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [store]),
    // Добавление жирного шрифта
    handleBold: useCallback(() => {
      setIsBold(true);
      setFontOpen(false);
    }, [setIsBold]),
    // Отмена жирного шрифта
    handleNormal: useCallback(() => {
      setIsBold(false);
      setFontOpen(false);
    }, [setIsBold]),
    // Показать или скрыть шрифты
    handleFont: useCallback(() => {
      setFontOpen(!fontOpen);
    }, [setFontOpen])
  };
  const resetTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
    }
  };
  const renders = {
    textarea: useCallback(
      () => /* @__PURE__ */ jsx(
        Textarea$1,
        {
          placeholder: "Написать сообщение...",
          addMessage: callbacks.onChange,
          adjustTextareaHeight: callbacks.adjustTextareaHeight,
          value: select.message,
          ref: textareaRef,
          isBold
        }
      ),
      [store, callbacks.onChange, select.message]
    ),
    font: useCallback(
      () => /* @__PURE__ */ jsx(
        MessageFont$1,
        {
          onClickBold: callbacks.handleBold,
          onClickNormal: callbacks.handleNormal
        }
      ),
      [store, callbacks.onChange, select.message]
    )
  };
  useEffect(() => {
    store.actions.chat.onConnect();
    return () => store.actions.chat.close();
  }, []);
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [select.messages]);
  return /* @__PURE__ */ jsxs(PageLayout$1, { children: [
    /* @__PURE__ */ jsx(TopHead$1, {}),
    /* @__PURE__ */ jsx(Head$1, { title: t("menu.chat"), children: /* @__PURE__ */ jsx(LocaleSelect$1, {}) }),
    /* @__PURE__ */ jsx(Navigation$1, {}),
    /* @__PURE__ */ jsx(
      ChatLayout$1,
      {
        onMessage: callbacks.onMessage,
        onLastMessage: callbacks.onLastMessage,
        onNewMessage: callbacks.onNewMessage,
        clearChat: callbacks.clearChat,
        messages: select.messages,
        name: select.name.username,
        ref: lastMessageRef,
        statusClearChat: select.statusClearChat,
        textarea: renders.textarea,
        font: renders.font,
        isfontOpen: fontOpen,
        setFontOpen,
        connected: select.connected
      }
    )
  ] });
};
const Chat$1 = memo(Chat);
class Figure {
  constructor(x = 0, y = 0, width = 10, height = 10) {
    this.x = 0;
    this.y = 0;
    this.width = 10;
    this.height = 10;
    this.angle = 10;
    this.time = performance.now();
    this.pause = false;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  animate(time) {
    time - this.time;
    this.angle += 5;
    if (this.angle > 360 || this.angle < -360)
      this.angle = 0;
  }
  setPause(pause = true) {
    this.pause = pause;
    this.time = performance.now();
  }
  setPosition({ x, y }) {
    this.x = x;
    this.y = y;
  }
  /**
   * Прямоугольная область элемента
   */
  getBoundRect() {
    return {
      x1: this.x,
      y1: this.y,
      x2: this.x + this.width,
      y2: this.y + this.height
    };
  }
  /**
   * Проверка попадания элемента в прямоугольную область
   * @param rect
   */
  isIntersectRect(rect) {
    const bound = this.getBoundRect();
    return bound.x1 <= rect.x2 && bound.x2 >= rect.x1 && bound.y1 <= rect.y2 && bound.y2 >= rect.y1;
  }
  get zIndex() {
    return 0;
  }
  draw(ctx) {
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.angle * Math.PI / 180);
    ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
    ctx.fillStyle = "#777";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;
const fastFloor = (x) => Math.floor(x) | 0;
const grad2 = /* @__PURE__ */ new Float64Array([
  1,
  1,
  -1,
  1,
  1,
  -1,
  -1,
  -1,
  1,
  0,
  -1,
  0,
  1,
  0,
  -1,
  0,
  0,
  1,
  0,
  -1,
  0,
  1,
  0,
  -1
]);
function createNoise2D(random = Math.random) {
  const perm = buildPermutationTable(random);
  const permGrad2x = new Float64Array(perm).map((v) => grad2[v % 12 * 2]);
  const permGrad2y = new Float64Array(perm).map((v) => grad2[v % 12 * 2 + 1]);
  return function noise2D(x, y) {
    let n0 = 0;
    let n1 = 0;
    let n2 = 0;
    const s = (x + y) * F2;
    const i = fastFloor(x + s);
    const j = fastFloor(y + s);
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = x - X0;
    const y0 = y - Y0;
    let i1, j1;
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      i1 = 0;
      j1 = 1;
    }
    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;
    const ii = i & 255;
    const jj = j & 255;
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) {
      const gi0 = ii + perm[jj];
      const g0x = permGrad2x[gi0];
      const g0y = permGrad2y[gi0];
      t0 *= t0;
      n0 = t0 * t0 * (g0x * x0 + g0y * y0);
    }
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 >= 0) {
      const gi1 = ii + i1 + perm[jj + j1];
      const g1x = permGrad2x[gi1];
      const g1y = permGrad2y[gi1];
      t1 *= t1;
      n1 = t1 * t1 * (g1x * x1 + g1y * y1);
    }
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 >= 0) {
      const gi2 = ii + 1 + perm[jj + 1];
      const g2x = permGrad2x[gi2];
      const g2y = permGrad2y[gi2];
      t2 *= t2;
      n2 = t2 * t2 * (g2x * x2 + g2y * y2);
    }
    return 70 * (n0 + n1 + n2);
  };
}
function buildPermutationTable(random) {
  const tableSize = 512;
  const p = new Uint8Array(tableSize);
  for (let i = 0; i < tableSize / 2; i++) {
    p[i] = i;
  }
  for (let i = 0; i < tableSize / 2 - 1; i++) {
    const r = i + ~~(random() * (256 - i));
    const aux = p[i];
    p[i] = p[r];
    p[r] = aux;
  }
  for (let i = 256; i < tableSize; i++) {
    p[i] = p[i - 256];
  }
  return p;
}
function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}
const leaf1 = "/assets/leave01-DRcTB3JJ.png";
const leaf2 = "/assets/leave02-DCbMdQGW.png";
const leaf3 = "/assets/leave03-BfHJIUTn.png";
const leaf4 = "/assets/leave04-CNUwx4wm.png";
const leaf6 = "/assets/leave06-Vr4xZh9D.png";
const leaf7 = "/assets/leave07-BSMWKsOv.png";
const leaf8 = "/assets/leave08-B3Q7lUSF.png";
const leaf9 = "/assets/leave09-B84YAOos.png";
const leaf10 = "/assets/leave10-BdasM4pY.png";
const leaf11 = "/assets/leave11-Bjnw1uxM.png";
const leafsImages = [leaf1, leaf2, leaf3, leaf4, leaf6, leaf7, leaf7, leaf8, leaf9, leaf10, leaf11];
function roundRange(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
const maxX = 500;
const maxY = 500;
const _Leaf = class _Leaf extends Figure {
  constructor() {
    super();
    this.loaded = false;
    this.image = new Image();
    this.noise = createNoise2D();
    this.scale = 1;
    this.angleZ = 0;
    this.aX = 2;
    this.aY = 9.8;
    this.aS = 0;
    this.aA = 0;
    this.vX = 0;
    this.vY = 0;
    this.vS = 0;
    this.vA = 0;
    this.image.onload = () => {
      this.loaded = true;
      this.reset();
    };
    this.renew();
  }
  renew() {
    const src = randomItem(leafsImages);
    if (src !== this.image.src) {
      this.loaded = false;
      this.image.src = src;
    } else {
      this.reset();
    }
  }
  reset() {
    this.noise = createNoise2D();
    this.x = Math.random() * 1500;
    this.y = -(Math.random() * 800 + 200);
    this.scale = Math.random() * 0.01;
    this.width = this.image.width * this.scale;
    this.height = this.image.height * this.scale;
    this.angle = 0;
    this.angleZ = 0;
    this.vX = 0;
    this.vY = Math.random() * 100 + 10;
    this.vS = Math.random() * 5;
    this.vA = Math.random() * 5;
  }
  get zIndex() {
    return this.width || 0;
  }
  animate(time) {
    if (this.loaded) {
      const dt = (time - this.time) / 2e3;
      const random = this.noise(this.x / maxX, this.y / maxY);
      const randomX = _Leaf.noiseX(this.x / maxX, this.y / maxY) * random;
      const randomY = _Leaf.noiseY(this.x / maxX, this.y / maxY) * random;
      const randomS = _Leaf.noiseS(this.x / maxX, this.y / maxY) * random;
      const randomA = _Leaf.noiseA(this.x / maxX, this.y / maxY) * random;
      if (this.y < 1e3 && this.y > -800 && this.x > -500 && this.x < 2e3) {
        this.aX = randomX * 500;
        this.aY = randomY + 50;
        this.aS = randomS / 600;
        this.aA = randomA * 5;
        if (!this.pause) {
          this.x += this.vX * dt + this.aX * dt ** 2 / 2;
          this.y += this.vY * dt + this.aY * dt ** 2 / 2;
        }
        this.scale += this.aS;
        this.angle += this.aA;
        this.angleZ = (this.aA + 1) / 2;
        if (!this.pause) {
          this.vX = this.vX + this.aX * dt;
          this.vY = this.vY + this.aY * dt;
        }
        this.vS = this.vS + this.aS * dt;
        this.vA = this.vA + this.aA * dt;
        this.scale = roundRange(this.scale, 0.5, 50);
        this.width = this.image.width * this.scale;
        this.height = this.image.height * this.scale;
      } else {
        this.renew();
      }
    }
    this.time = time;
  }
  draw(ctx) {
    if (this.loaded) {
      ctx.save();
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.rotate(this.angle * Math.PI / 180);
      ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      ctx.restore();
    }
  }
};
_Leaf.noiseX = createNoise2D();
_Leaf.noiseY = createNoise2D();
_Leaf.noiseS = createNoise2D();
_Leaf.noiseA = createNoise2D();
let Leaf = _Leaf;
class Core {
  constructor() {
    this.root = null;
    this.canvas = null;
    this.ctx = null;
    this.elements = [];
    this.metrics = {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      dpr: 1,
      scrollX: 0,
      scrollY: 0,
      zoom: 1
    };
    this.action = null;
    this.resize = () => {
      if (this.root && this.canvas && this.ctx) {
        const rect = this.root.getBoundingClientRect();
        this.metrics.left = rect.left;
        this.metrics.top = rect.top;
        this.metrics.width = this.root.offsetWidth;
        this.metrics.height = this.root.offsetHeight;
        this.metrics.dpr = window == null ? void 0 : window.devicePixelRatio;
        this.canvas.width = this.metrics.width * this.metrics.dpr;
        this.canvas.height = this.metrics.height * this.metrics.dpr;
        this.canvas.style.width = `${this.metrics.width}px`;
        this.canvas.style.height = `${this.metrics.height}px`;
        this.ctx.scale(this.metrics.dpr, this.metrics.dpr);
      }
    };
    this.onMouseDown = (e) => {
      const point = {
        x: (e.clientX - this.metrics.left + this.metrics.scrollX) / this.metrics.zoom,
        y: (e.clientY - this.metrics.top + this.metrics.scrollY) / this.metrics.zoom
      };
      console.log("Сработал onMouseDown, point ===", point);
      const element = this.findElementByPont(point);
      if (element) {
        this.action = {
          name: "drag",
          element,
          // Координата, с которой начинаем расчёт смещения
          x: point.x,
          y: point.y,
          // Координаты фигуры
          targetX: element.x,
          targetY: element.y
        };
        element.setPause(true);
      } else {
        this.action = {
          name: "scroll",
          // Координата, с которой начинаем расчёт смещения (учитывать зум не нужно)
          x: e.clientX - this.metrics.left,
          y: e.clientY - this.metrics.top,
          // Запоминаем исходное смещение, чтобы к нему добавлять расчётное
          targetX: this.metrics.scrollX,
          targetY: this.metrics.scrollY
        };
      }
    };
    this.onMouseMove = (e) => {
      const point = {
        x: (e.clientX - this.metrics.left + this.metrics.scrollX) / this.metrics.zoom,
        y: (e.clientY - this.metrics.top + this.metrics.scrollY) / this.metrics.zoom
      };
      if (this.action) {
        if (this.action.name === "drag" && this.action.element) {
          this.action.element.setPosition({
            x: this.action.targetX + point.x - this.action.x,
            y: this.action.targetY + point.y - this.action.y
          });
        }
        if (this.action.name === "scroll") {
          this.scroll({
            x: this.action.targetX - (e.clientX - this.metrics.left - this.action.x),
            y: this.action.targetY - (e.clientY - this.metrics.top - this.action.y)
          });
        }
      }
    };
    this.onMouseUp = (e) => {
      if (this.action) {
        if (this.action.name === "drag" && this.action.element) {
          this.action.element.setPause(false);
        }
      }
      this.action = null;
    };
    this.onMouseWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.1 : -0.1;
      if (e.ctrlKey) {
        this.zoom({ delta, center: { x: e.offsetX, y: e.offsetY } });
      } else {
        this.scroll({ dy: delta * 300 });
      }
    };
    this.draw = () => {
      if (this.ctx) {
        const viewRect = {
          x1: this.metrics.scrollX / this.metrics.zoom,
          y1: this.metrics.scrollY / this.metrics.zoom,
          x2: (this.metrics.width + this.metrics.scrollX) / this.metrics.zoom,
          y2: (this.metrics.height + this.metrics.scrollY) / this.metrics.zoom
        };
        this.ctx.save();
        this.ctx.fillStyle = "#ebf4ff";
        this.ctx.fillRect(0, 0, this.metrics.width, this.metrics.height);
        this.ctx.translate(-this.metrics.scrollX, -this.metrics.scrollY);
        this.ctx.scale(this.metrics.zoom, this.metrics.zoom);
        const time = performance.now();
        const sorted = this.elements.sort((a, b) => {
          if (a.zIndex > b.zIndex)
            return 1;
          if (a.zIndex < b.zIndex)
            return -1;
          return 0;
        });
        for (const element of sorted) {
          element.animate(time);
          if (element.isIntersectRect(viewRect)) {
            this.ctx.save();
            element.draw(this.ctx);
            this.ctx.restore();
          }
        }
        this.ctx.restore();
        requestAnimationFrame(this.draw);
      }
    };
    for (let i = 0; i < 70; i++) {
      this.elements.push(new Leaf());
    }
  }
  /**
   * Монтирование канвы в DOM элемент (dom)
   * @param root
   */
  mount(root) {
    this.root = root;
    this.canvas = document.createElement("canvas");
    this.root.appendChild(this.canvas);
    window == null ? void 0 : window.addEventListener("resize", this.resize);
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    window == null ? void 0 : window.addEventListener("mousemove", this.onMouseMove);
    window == null ? void 0 : window.addEventListener("mouseup", this.onMouseUp);
    this.canvas.addEventListener("wheel", this.onMouseWheel);
    this.ctx = this.canvas.getContext("2d", { alpha: false });
    if (this.ctx) {
      this.ctx.imageSmoothingEnabled = false;
      this.resize();
      this.draw();
    } else {
      throw new Error("Не удалось создать CanvasRenderingContext2D");
    }
  }
  /**
   * Демонтирование канвы
   */
  unmount() {
    if (this.canvas) {
      window == null ? void 0 : window.removeEventListener("resize", this.resize);
      window == null ? void 0 : window.removeEventListener("mousemove", this.onMouseMove);
      window == null ? void 0 : window.removeEventListener("mouseup", this.onMouseUp);
      this.canvas.removeEventListener("mousedown", this.onMouseDown);
      this.canvas.removeEventListener("wheel", this.onMouseWheel);
      if (this.root)
        this.root.removeChild(this.canvas);
      this.canvas = null;
      this.ctx = null;
    }
  }
  /**
   * Смещение области обзора (прокрутка по горизонтали и/или вертикали)
   * @param x Точная позиция по горизонтали
   * @param y Точная позиция по вертикали
   * @param dx Добавить смещение по горизонтали
   * @param dy Добавить смещение по вертикали
   */
  scroll({ x, y, dx, dy }) {
    if (typeof x != "undefined")
      this.metrics.scrollX = x;
    if (typeof y != "undefined")
      this.metrics.scrollY = y;
    if (typeof dx != "undefined")
      this.metrics.scrollX += dx;
    if (typeof dy != "undefined")
      this.metrics.scrollY += dy;
  }
  /**
   * Установка масштаба
   * @param zoom Точная установка (1 = 100%)
   * @param delta Изменение текущего масштаба на коэффициент, например -0.1
   * @param center Центр масштабирования (точка, которая визуально не сместится)
   */
  zoom({ zoom, delta, center }) {
    const centerReal = {
      x: (center.x + this.metrics.scrollX) / this.metrics.zoom,
      y: (center.y + this.metrics.scrollY) / this.metrics.zoom
    };
    if (typeof zoom != "undefined")
      this.metrics.zoom = zoom;
    if (typeof delta != "undefined")
      this.metrics.zoom += delta * this.metrics.zoom;
    this.metrics.zoom = Math.max(0.1, this.metrics.zoom);
    const centerNew = {
      x: centerReal.x * this.metrics.zoom,
      y: centerReal.y * this.metrics.zoom
    };
    this.scroll({
      x: centerNew.x - center.x,
      y: centerNew.y - center.y
    });
  }
  /**
   * Поиск элемента по точке
   * @param x
   * @param y
   */
  findElementByPont({ x, y }) {
    const sorted = this.elements.sort((a, b) => {
      if (a.zIndex < b.zIndex)
        return 1;
      if (a.zIndex > b.zIndex)
        return -1;
      return 0;
    });
    for (const element of sorted) {
      if (element.isIntersectRect({ x1: x - 1, y1: y - 1, x2: x + 1, y2: y + 2 })) {
        return element;
      }
    }
    return null;
  }
}
function DrawLeaf() {
  const dom = useRef(null);
  const core = useMemo(() => new Core(), []);
  useEffect(() => {
    if (dom.current)
      core.mount(dom.current);
    return () => core.unmount();
  }, []);
  return /* @__PURE__ */ jsx("div", { className: "Draw", ref: dom });
}
const DrawLeaf$1 = React.memo(DrawLeaf);
function LeafFall() {
  const { t } = useTranslate();
  return /* @__PURE__ */ jsxs(PageLayout$1, { children: [
    /* @__PURE__ */ jsx(TopHead$1, {}),
    /* @__PURE__ */ jsx(Head$1, { title: t("menu.leaf"), children: /* @__PURE__ */ jsx(LocaleSelect$1, {}) }),
    /* @__PURE__ */ jsx(Navigation$1, {}),
    /* @__PURE__ */ jsx(DrawLeaf$1, {})
  ] });
}
const LeafFall$1 = memo(LeafFall);
const DrawingLayout = ({ children }) => {
  const cn$1 = cn("Drawing_layout");
  return /* @__PURE__ */ jsx("div", { className: cn$1(), children });
};
const DrawingLayout$1 = memo(DrawingLayout);
class Tool {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext("2d") : null;
    this.allFiguresTool = [];
    this.destroyEvents();
    this.animationId;
  }
  set fillColor(color) {
    this.ctx && (this.ctx.fillStyle = color);
  }
  set strokeColor(color) {
    this.ctx && (this.ctx.strokeStyle = color);
  }
  set lineWidth(width) {
    this.ctx && (this.ctx.lineWidth = width);
  }
  destroyEvents() {
    if (this.canvas) {
      this.canvas.onmousemove = null;
      this.canvas.onmousedown = null;
      this.canvas.onmouseup = null;
    }
  }
  animation(params) {
    const { update, render: render2, clear } = params;
    let pTimestamp = 0;
    const tick = (timestamp) => {
      this.animationId = requestAnimationFrame(tick);
      console.log("timestamp", timestamp);
      const diff = timestamp - pTimestamp;
      const fps = 1e3 / diff;
      const secondPart = diff / 1e3;
      pTimestamp = timestamp;
      const params2 = {
        // Создание объекта params со значениями разницы времени, временных меток, FPS и доли секунды
        diff,
        timestamp,
        pTimestamp,
        fps,
        secondPart
      };
      update(params2);
      clear();
      render2(params2);
    };
    requestAnimationFrame(tick);
  }
}
class Brush extends Tool {
  constructor(canvas) {
    super(canvas);
    this.listen();
    this.figures = null;
  }
  listen() {
    if (this.canvas) {
      this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
      this.canvas.onmousedown = this.mouseDownHandler.bind(this);
      this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    }
  }
  // Обработчик события отпускания кнопки мыши
  mouseUpHandler(e) {
    this.mouseDown = false;
    const allFigures = this.allFiguresTool;
    this.allFiguresTool = [...allFigures, this.figures];
  }
  // Обработчик события нажатия кнопки мыши
  mouseDownHandler(e) {
    this.mouseDown = true;
    if (this.ctx && e.target instanceof HTMLElement) {
      this.ctx.beginPath();
      const rect = this.canvas.getBoundingClientRect();
      this.ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      const startPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      this.figures = { type: "freeDraw", points: [startPoint] };
    }
  }
  // Обработчик события перемещения мыши
  mouseMoveHandler(e) {
    if (this.mouseDown && e.target instanceof HTMLElement) {
      const rect = this.canvas.getBoundingClientRect();
      const currentPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      this.figures && this.figures.points.push(currentPoint);
      this.draw(e.clientX - rect.left, e.clientY - rect.top);
    }
  }
  // Рисование на холсте
  draw(x, y) {
    if (this.ctx) {
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    }
  }
}
class Rectangle extends Tool {
  constructor(canvas) {
    super(canvas);
    this.listen();
    this.rect = null;
    this.figures = null;
  }
  listen() {
    if (this.canvas) {
      this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
      this.canvas.onmousedown = this.mouseDownHandler.bind(this);
      this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    }
  }
  // Обработчик события отпускания кнопки мыши
  mouseUpHandler(e) {
    this.mouseDown = false;
    const allFigures = this.allFiguresTool;
    this.allFiguresTool = [...allFigures, this.figures];
  }
  // Обработчик события нажатия кнопки мыши
  mouseDownHandler(e) {
    this.mouseDown = true;
    if (this.ctx && e.target instanceof HTMLElement) {
      this.ctx.beginPath();
      const rect = this.canvas.getBoundingClientRect();
      this.startX = e.clientX - rect.left;
      this.startY = e.clientY - rect.top;
      this.saved = this.canvas.toDataURL();
    }
  }
  // Обработчик события перемещения мыши
  mouseMoveHandler(e) {
    if (this.mouseDown && e.target instanceof HTMLElement) {
      const rect = this.canvas.getBoundingClientRect();
      let currentX = e.clientX - rect.left;
      let currentY = e.clientY - rect.top;
      let width = currentX - this.startX;
      let height = currentY - this.startY;
      this.figures = {
        type: "rectangle",
        x: this.startX,
        y: this.startY,
        width,
        height
      };
      this.draw(this.startX, this.startY, width, height);
    }
  }
  // Рисование на холсте
  draw(x, y, w, h) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.rect(x, y, w, h);
      this.ctx.fill();
      this.ctx.stroke();
    };
  }
}
class Circle extends Tool {
  constructor(canvas) {
    super(canvas);
    this.listen();
    this.figures = null;
  }
  listen() {
    if (this.canvas) {
      this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
      this.canvas.onmousedown = this.mouseDownHandler.bind(this);
      this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    }
  }
  // Обработчик события отпускания кнопки мыши
  mouseUpHandler(e) {
    this.mouseDown = false;
    const allFigures = this.allFiguresTool;
    this.allFiguresTool = [...allFigures, this.figures];
  }
  // Обработчик события нажатия кнопки мыши
  mouseDownHandler(e) {
    this.mouseDown = true;
    if (this.ctx && e.target instanceof HTMLElement) {
      const canvasData = this.canvas.toDataURL();
      this.ctx.beginPath();
      const rect = this.canvas.getBoundingClientRect();
      this.startX = e.clientX - rect.left;
      this.startY = e.clientY - rect.top;
      this.saved = canvasData;
    }
  }
  // Обработчик события перемещения мыши
  mouseMoveHandler(e) {
    if (this.mouseDown && e.target instanceof HTMLElement) {
      const rect = this.canvas.getBoundingClientRect();
      let currentX = e.clientX - rect.left;
      let currentY = e.clientY - rect.top;
      let width = currentX - this.startX;
      let height = currentY - this.startY;
      let radius = Math.sqrt(width ** 2 + height ** 2);
      this.figures = {
        type: "circle",
        x: this.startX,
        y: this.startY,
        radius
      };
      this.draw(this.startX, this.startY, radius);
    }
  }
  // Рисование на холсте
  draw(x, y, radius) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.stroke();
    };
  }
}
class Eraser extends Brush {
  constructor(canvas) {
    super(canvas);
  }
  draw(x, y) {
    if (this.ctx) {
      this.ctx.strokeStyle = "white";
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    }
  }
}
class Line extends Tool {
  constructor(canvas) {
    super(canvas);
    this.listen();
    this.figures = null;
  }
  listen() {
    if (this.canvas) {
      this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
      this.canvas.onmousedown = this.mouseDownHandler.bind(this);
      this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    }
  }
  // Обработчик события отпускания кнопки мыши
  mouseUpHandler(e) {
    this.mouseDown = false;
    const allFigures = this.allFiguresTool;
    this.allFiguresTool = [...allFigures, this.figures];
  }
  // Обработчик события нажатия кнопки мыши
  mouseDownHandler(e) {
    this.mouseDown = true;
    if (this.ctx && e.target instanceof HTMLElement) {
      const rect = this.canvas.getBoundingClientRect();
      this.currentX = e.clientX - rect.left;
      this.currentY = e.clientY - rect.top;
      this.ctx.beginPath();
      this.ctx.moveTo(this.currentX, this.currentY);
      this.saved = this.canvas.toDataURL();
      this.figures = {
        type: "line",
        startX: this.currentX,
        startY: this.currentY,
        endX: this.currentX,
        endY: this.currentY
      };
    }
  }
  // Обработчик события перемещения мыши
  mouseMoveHandler(e) {
    if (this.mouseDown && e.target instanceof HTMLElement) {
      const rect = this.canvas.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;
      this.draw(newX, newY);
      this.figures.endX = newX;
      this.figures.endY = newY;
    }
  }
  // Рисование на холсте
  draw(x, y) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "black";
      this.ctx.beginPath();
      this.ctx.moveTo(this.currentX, this.currentY);
      this.ctx.lineTo(x, y);
      this.ctx.fill();
      this.ctx.stroke();
    };
  }
}
class Pointer extends Tool {
  constructor(canvas, shapes) {
    super(canvas);
    this.selectedShape = null;
    this.shapes = shapes;
    this.listen();
  }
  listen() {
    if (this.canvas) {
      this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
      this.canvas.onmousedown = this.mouseDownHandler.bind(this);
      this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    }
  }
  // Обработчик события отпускания кнопки мыши
  mouseUpHandler(e) {
    this.mouseDown = false;
    this.selectedShape = null;
  }
  // Обработчик события нажатия кнопки мыши
  mouseDownHandler(e) {
    this.mouseDown = true;
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    this.selectedShape = this.getShapeAtPosition(mouseX, mouseY);
    if (this.selectedShape && this.selectedShape.type === "line") {
      this.startX = this.selectedShape.startX;
      this.startY = this.selectedShape.startY;
    } else {
      this.startX = mouseX;
      this.startY = mouseY;
    }
    if (this.selectedShape && this.selectedShape.type === "line") {
      this.selectedShapeStartX = this.selectedShape.startX;
      this.selectedShapeStartY = this.selectedShape.startY;
      this.selectedShapeEndX = this.selectedShape.endX;
      this.selectedShapeEndY = this.selectedShape.endY;
    }
  }
  // Обработчик события перемещения мыши
  mouseMoveHandler(e) {
    if (this.mouseDown && this.selectedShape) {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const deltaX = mouseX - this.startX;
      const deltaY = mouseY - this.startY;
      if (this.selectedShape.type === "line") {
        this.selectedShape.startX = this.selectedShapeStartX + deltaX;
        this.selectedShape.startY = this.selectedShapeStartY + deltaY;
        this.selectedShape.endX = this.selectedShapeEndX + deltaX;
        this.selectedShape.endY = this.selectedShapeEndY + deltaY;
      } else if (this.selectedShape.type === "freeDraw") {
        for (const point of this.selectedShape.points) {
          point.x += deltaX;
          point.y += deltaY;
        }
      } else {
        const selected = this.selectedShape;
        selected.x += deltaX;
        selected.y += deltaY;
      }
      this.redrawCanvas();
      if (this.selectedShape && this.selectedShape.type !== "line") {
        this.startX = mouseX;
        this.startY = mouseY;
      }
    }
  }
  redrawCanvas() {
    if (!this.canvas || !this.ctx || !this.shapes)
      return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const shape of this.shapes) {
      if (shape.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
      }
      if (shape.type === "rectangle") {
        this.ctx.beginPath();
        this.ctx.rect(shape.x, shape.y, shape.width, shape.height);
        this.ctx.fill();
        this.ctx.stroke();
      }
      if (shape.type === "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.startX, shape.startY);
        this.ctx.lineTo(shape.endX, shape.endY);
        this.ctx.stroke();
      }
      if (shape.type === "freeDraw") {
        if (shape.points.length > 1) {
          this.ctx.beginPath();
          this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
          for (let i = 1; i < shape.points.length; i++) {
            this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
          }
          this.ctx.stroke();
        }
      }
    }
  }
  // Метод для определения фигуры в заданной точке
  getShapeAtPosition(x, y) {
    if (this.shapes)
      for (const shape of this.shapes) {
        switch (shape.type) {
          case "circle":
            const distance = Math.sqrt((x - shape.x) ** 2 + (y - shape.y) ** 2);
            if (distance <= shape.radius) {
              return shape;
            }
            break;
          case "rectangle":
            if (x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height) {
              return shape;
            }
            break;
          case "line":
            const distanceFromStart = Math.sqrt((x - shape.startX) ** 2 + (y - shape.startY) ** 2);
            const distanceFromEnd = Math.sqrt((x - shape.endX) ** 2 + (y - shape.endY) ** 2);
            const length = Math.sqrt((shape.startX - shape.endX) ** 2 + (shape.startY - shape.endY) ** 2);
            const epsilon = 5;
            if (distanceFromStart + distanceFromEnd >= length - epsilon && distanceFromStart + distanceFromEnd <= length + epsilon) {
              return shape;
            }
            break;
          case "freeDraw":
            if (this.isPointInPath(x, y, shape.points)) {
              return shape;
            }
            break;
        }
      }
    return null;
  }
  // Метод для определения принадлежности точки пути (используется для freeDraw)
  isPointInPath(x, y, points) {
    if (points.length < 2)
      return false;
    let inside = false;
    const epsilon = 1;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const xi = points[i].x, yi = points[i].y;
      const xj = points[j].x, yj = points[j].y;
      const xiMin = Math.min(xi, xj) - epsilon;
      const xiMax = Math.max(xi, xj) + epsilon;
      const yiMin = Math.min(yi, yj) - epsilon;
      const yiMax = Math.max(yi, yj) + epsilon;
      if (x >= xiMin && x <= xiMax && y >= yiMin && y <= yiMax)
        return true;
      const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
      if (intersect)
        inside = !inside;
      if (xi === x && yi === y || xj === x && yj === y)
        return true;
    }
    return inside;
  }
}
class Fall extends Pointer {
  constructor(canvas, shapes) {
    super(canvas, shapes);
    this.startFallAnimation();
  }
  startFallAnimation() {
    this.animation({
      update: (params) => {
        this.fallFiguresSmoothly(params.secondPart);
      },
      render: () => {
        this.redrawCanvas();
      },
      clear: () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    });
  }
  // Метод для плавного падения всех фигур на canvas
  fallFiguresSmoothly(timeFraction) {
    console.log("this.shapes", this.shapes);
    if (!this.shapes)
      return;
    this.shapes.forEach((figure) => {
      if (figure.type === "rectangle") {
        const canvasBottom = this.canvas.height - figure.height;
        if (figure.y < canvasBottom) {
          figure.y += 1;
        }
      }
      if (figure.type === "circle") {
        const canvasBottom = this.canvas.height - figure.radius;
        if (figure.y < canvasBottom) {
          figure.y += 1;
        }
      }
      if (figure.type === "line") {
        const canvasBottom = this.canvas.height;
        if (figure.startY < canvasBottom && figure.endY < canvasBottom) {
          figure.startY += 1;
          figure.endY += 1;
        }
      }
      if (figure.type === "freeDraw") {
        let maxY2 = -Infinity;
        for (const point of figure.points) {
          if (point.y > maxY2) {
            maxY2 = point.y;
          }
        }
        const canvasBottom = this.canvas.height;
        if (maxY2 < canvasBottom) {
          for (const point of figure.points) {
            point.y += 1;
          }
        }
      }
    });
  }
}
const Toolbar = () => {
  const store = useStore();
  const cn$1 = cn("Toolbar");
  const [nameTool, setNameTool] = useState("freeDraw");
  const select = useSelector((state) => ({
    canvas: state.canvas.canvas,
    figures: state.canvas.figures,
    tool: state.canvas.tool
  }));
  const changeColor = (e) => {
    store.actions.canvas.setFillColor(e.target.value);
    store.actions.canvas.setStrokeColor(e.target.value);
  };
  const download = () => {
    const dataUrl = select.canvas.toDataURL();
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "canvas.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const onTool = (name) => {
    if (nameTool === "fall") {
      const animationId = select.tool.animationId;
      cancelAnimationFrame(animationId);
    }
    setNameTool(name);
    store.actions.canvas.setFigures();
    if (name === "freeDraw")
      store.actions.canvas.setTool(new Brush(select.canvas), "freeDraw");
    if (name === "rectangle")
      store.actions.canvas.setTool(new Rectangle(select.canvas), "rectangle");
    if (name === "circle")
      store.actions.canvas.setTool(new Circle(select.canvas), "circle");
    if (name === "eraser")
      store.actions.canvas.setTool(new Eraser(select.canvas), "eraser");
    if (name === "line") {
      store.actions.canvas.setTool(new Line(select.canvas), "line");
      store.actions.canvas.setStrokeColor("black");
    }
  };
  useEffect(() => {
    if (select.figures.length > 0 && nameTool === "pointer")
      store.actions.canvas.setTool(new Pointer(select.canvas, select.figures), "pointer");
    if (select.figures.length > 0 && nameTool === "fall")
      store.actions.canvas.setTool(new Fall(select.canvas, select.figures), "fall");
  }, [select.figures]);
  return /* @__PURE__ */ jsxs("div", { className: cn$1(), children: [
    /* @__PURE__ */ jsx("span", { children: "Инструменты" }),
    /* @__PURE__ */ jsx("button", { className: cn$1("btn", { brush: true }), onClick: () => onTool("freeDraw") }),
    /* @__PURE__ */ jsx("button", { className: cn$1("btn", { rect: true }), onClick: () => onTool("rectangle") }),
    /* @__PURE__ */ jsx("button", { className: cn$1("btn", { circle: true }), onClick: () => onTool("circle") }),
    /* @__PURE__ */ jsx("button", { className: cn$1("btn", { eraser: true }), onClick: () => onTool("eraser") }),
    /* @__PURE__ */ jsx("button", { className: cn$1("btn", { line: true }), onClick: () => onTool("line") }),
    /* @__PURE__ */ jsx("input", { className: cn$1("btn", { color: true }), onChange: (e) => changeColor(e), style: { marginLeft: 10 }, type: "color" }),
    /* @__PURE__ */ jsx("button", { className: cn$1("btn", { pointer: true }), onClick: () => onTool("pointer") }),
    /* @__PURE__ */ jsx("button", { className: cn$1("btn", { arrow: true }), onClick: () => onTool("fall") }),
    /* @__PURE__ */ jsx("button", { className: cn$1("btn", { undo: true }), onClick: () => store.actions.canvas.undo() }),
    /* @__PURE__ */ jsx("button", { className: cn$1("btn", { redo: true }), onClick: () => store.actions.canvas.redo() }),
    /* @__PURE__ */ jsx("button", { className: cn$1("btn", { save: true }), onClick: () => download() })
  ] });
};
const Toolbar$1 = memo(Toolbar);
const SettingBar = () => {
  const cn$1 = cn("Setting_bar");
  const store = useStore();
  return /* @__PURE__ */ jsxs("div", { className: cn$1(), children: [
    /* @__PURE__ */ jsx("label", { htmlFor: "line-width", children: "Толщина линии" }),
    /* @__PURE__ */ jsx(
      "input",
      {
        className: cn$1("input"),
        onChange: (e) => store.actions.canvas.setLineWidth(Number(e.target.value)),
        id: "line-width",
        type: "number",
        defaultValue: 1,
        min: 1,
        max: 50
      }
    ),
    /* @__PURE__ */ jsx("label", { htmlFor: "stroke-color", children: "Цвет обводки" }),
    /* @__PURE__ */ jsx(
      "input",
      {
        className: cn$1("input", { color: true }),
        onChange: (e) => store.actions.canvas.setStrokeColor(e.target.value),
        id: "stroke-color",
        type: "color"
      }
    )
  ] });
};
const SettingBar$1 = memo(SettingBar);
const Canvas = () => {
  const canvasRef = useRef(null);
  const store = useStore();
  const cn$1 = cn("Canvas");
  useSelector((state) => ({
    figures: state.canvas.tool
  }));
  const mouseDownHandler = () => {
    if (canvasRef.current) {
      store.actions.canvas.pushToUndo(canvasRef.current.toDataURL());
    }
  };
  useEffect(() => {
    canvasRef.current && store.actions.canvas.setCannvas(canvasRef.current);
    store.actions.canvas.setTool(new Brush(canvasRef.current), "freeDraw");
  }, []);
  return /* @__PURE__ */ jsx("div", { className: cn$1(), children: /* @__PURE__ */ jsx("canvas", { onMouseDown: () => mouseDownHandler(), width: 600, height: 400, ref: canvasRef }) });
};
const Canvas$1 = memo(Canvas);
function Drawing() {
  const { t } = useTranslate();
  return /* @__PURE__ */ jsxs(PageLayout$1, { children: [
    /* @__PURE__ */ jsx(TopHead$1, {}),
    /* @__PURE__ */ jsx(Head$1, { title: t("menu.drawing"), children: /* @__PURE__ */ jsx(LocaleSelect$1, {}) }),
    /* @__PURE__ */ jsx(Navigation$1, {}),
    /* @__PURE__ */ jsxs(DrawingLayout$1, { children: [
      /* @__PURE__ */ jsx(Toolbar$1, {}),
      /* @__PURE__ */ jsx(SettingBar$1, {}),
      /* @__PURE__ */ jsx(Canvas$1, {})
    ] })
  ] });
}
const Drawing$1 = memo(Drawing);
function App() {
  const store = useStore();
  useInit(async () => {
    await store.actions.session.remind();
  });
  const activeModal = useSelector$1((state) => state.modals.activeModal);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Routes, { children: [
      /* @__PURE__ */ jsx(Route, { path: "", element: /* @__PURE__ */ jsx(Main$1, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/articles/:id", element: /* @__PURE__ */ jsx(Article$1, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/login", element: /* @__PURE__ */ jsx(Login$1, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/leaf", element: /* @__PURE__ */ jsx(LeafFall$1, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/drawing", element: /* @__PURE__ */ jsx(Drawing$1, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/profile", element: /* @__PURE__ */ jsx(Protected$1, { redirect: "/login", children: /* @__PURE__ */ jsx(Profile$1, {}) }) }),
      /* @__PURE__ */ jsx(Route, { path: "/chat", element: /* @__PURE__ */ jsx(Protected$1, { redirect: "/login", children: /* @__PURE__ */ jsx(Chat$1, {}) }) })
    ] }),
    activeModal && /* @__PURE__ */ jsx(Modals$1, {})
  ] });
}
class APIService {
  /**
   * @param services {Services} Менеджер сервисов
   * @param config {Object}
   */
  constructor(services, config2 = {}) {
    this.services = services;
    this.config = config2;
    this.defaultHeaders = {
      "Content-Type": "application/json"
    };
  }
  /**
   * HTTP запрос
   * @param url
   * @param method
   * @param headers
   * @param options
   * @returns {Promise<{}>}
   */
  async request({
    url,
    method = "GET",
    headers = {},
    ...options
  }) {
    if (!url.match(/^(http|\/\/)/))
      url = this.config.baseUrl + url;
    const res = await fetch(url, {
      method,
      headers: { ...this.defaultHeaders, ...headers },
      ...options
    });
    return { data: await res.json(), status: res.status, headers: res.headers };
  }
  /**
   * Установка или сброс заголовка
   * @param name {String} Название заголовка
   * @param value {String|null} Значение заголовка
   */
  setHeader(name, value = null) {
    if (value) {
      this.defaultHeaders[name] = value;
    } else if (this.defaultHeaders[name]) {
      delete this.defaultHeaders[name];
    }
  }
}
class WebSocketService {
  constructor(services, config2 = {}) {
    this.services = services;
    this.config = config2;
  }
  /**
   * Установка WebSocket соединения
   * @param url Адрес WebSocket сервера
   * @param protocols Протоколы, поддерживаемые сервером
   */
  connect(url) {
    const fullUrl = this.getWebSocketUrl(url);
    this.socket = new WebSocket(fullUrl);
  }
  /**
   * Отправка данных по WebSocket соединению
   * @param data Данные для отправки
   */
  send(method, payload) {
    const data = JSON.stringify({
      method,
      payload: {
        ...payload
      }
    });
    if (this.socket) {
      this.socket.send(data);
    } else {
      console.error("WebSocket connection is not open.");
    }
  }
  /**
   * Закрытие WebSocket соединения
   * @param code Код закрытия
   * @param reason Причина закрытия
   */
  close(code, reason) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
  }
  /**
   * Получение полного URL для WebSocket соединения
   * @param url Адрес WebSocket сервера
   * @returns Полный URL
   */
  getWebSocketUrl(url) {
    if (!url.match(/^(ws|wss|\/\/)/)) {
      return (this.config.baseUrl || "ws://") + url;
    }
    return url;
  }
}
class StoreModule {
  /**
   * @param store {Store}
   * @param name {String}
   * @param [config] {Object}
   */
  constructor(store, name, config2 = {}) {
    this.store = store;
    this.name = name;
    this.config = config2;
    this.services = store.services;
  }
  initState() {
    return {};
  }
  initConfig() {
    return {};
  }
  getState() {
    return this.store.getState()[this.name];
  }
  setState(newState, description = "setState") {
    this.store.setState(
      {
        ...this.store.getState(),
        [this.name]: newState
      },
      description
    );
  }
}
class BasketState extends StoreModule {
  initState() {
    return {
      list: [],
      sum: 0,
      amount: 0,
      quantity: 0,
      selected: []
    };
  }
  /**
   * Добавление товара в корзину
   * @param _id {String} Код товара
   */
  async addToBasket(_id, amountGoods) {
    let sum = 0;
    let exist = false;
    const list = this.getState().list.map(
      (item) => {
        let result = item;
        if (item._id === _id) {
          exist = true;
          amountGoods ? result = { ...item, amount: item.amount + amountGoods } : result = { ...item, amount: item.amount + 1 };
        }
        sum += result.price * result.amount;
        return result;
      }
    );
    if (!exist) {
      const res = await this.services.api.request({
        url: `/api/v1/articles/${_id}`
      });
      const item = res.data.result;
      list.push({ ...item, amount: amountGoods ? amountGoods : 1 });
      amountGoods ? sum += item.price * amountGoods : sum += item.price;
    }
    this.setState(
      {
        ...this.getState(),
        list,
        sum,
        amount: list.length,
        quantity: 0
      },
      "Добавление в корзину"
    );
  }
  /**
   * Удаление товара из корзины
   * @param _id Код товара
   */
  removeFromBasket(_id) {
    let sum = 0;
    const list = this.getState().list.filter((item) => {
      if (item._id === _id)
        return false;
      sum += item.price * item.amount;
      return true;
    });
    this.setState(
      {
        ...this.getState(),
        list,
        sum,
        amount: list.length
      },
      "Удаление из корзины"
    );
  }
  /**
   * Добавление результата модального окна с количеством товара
   * @param quantity {Number}
   */
  updateQuantityProduct(quantity) {
    this.setState({
      ...this.getState(),
      quantity
    });
  }
  /**
   * Добавление объекта в selected
   * @param {Array}
   */
  updateSelected(selectedId) {
    this.setState({
      ...this.getState(),
      selected: [
        ...this.getState().selected,
        {
          id: selectedId,
          quantity: this.getState().quantity
        }
      ],
      quantity: 0
    });
  }
  /**
   * Удаление объекта из selected
   * @param _id Код товара
   */
  removeFromSelected(id) {
    this.setState({
      ...this.getState(),
      selected: this.getState().selected.filter(
        (item) => item.id !== id
      )
    });
  }
  /**
   * Добавление выбранных товаров из модального окна
   * @param {}
   */
  async addingSelectedProducts() {
    const selected = this.getState().selected;
    if (selected.length === 0) {
      return;
    }
    const firstSelected = selected.shift();
    if (firstSelected)
      await this.addToBasket(firstSelected.id, firstSelected.quantity);
    await this.addingSelectedProducts();
  }
}
function isPlainObject$1(value) {
  return value && (!value.__proto__ || Object.getPrototypeOf(value).constructor.name === "Object");
}
function exclude(objectSrc, objectExc) {
  if (isPlainObject$1(objectSrc) && isPlainObject$1(objectExc)) {
    const result = {};
    const keys = Object.keys(objectSrc);
    for (const key of keys) {
      if (objectSrc[key] !== objectExc[key]) {
        const value = exclude(objectSrc[key], objectExc[key]);
        if (typeof value !== "undefined") {
          result[key] = value;
        }
      }
    }
    return Object.keys(result).length ? result : void 0;
  } else {
    return objectSrc;
  }
}
class CatalogState extends StoreModule {
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {
      list: [],
      params: {
        page: 1,
        limit: 10,
        sort: "order",
        query: "",
        category: "",
        madeIn: ""
      },
      count: 0,
      waiting: false
    };
  }
  /**
   * Инициализация параметров.
   * Восстановление из адреса
   * @param [newParams] {Object} Новые параметры
   * @return {Promise<void>}
   */
  async initParams(newParams = {}) {
    const urlParams = new URLSearchParams(window.location.search);
    let validParams = {};
    if (urlParams.has("page"))
      validParams.page = Number(urlParams.get("page")) || 1;
    if (urlParams.has("limit"))
      validParams.limit = Math.min(Number(urlParams.get("limit")) || 10, 50);
    if (urlParams.has("sort"))
      validParams.sort = urlParams.get("sort");
    if (urlParams.has("query"))
      validParams.query = urlParams.get("query");
    if (urlParams.has("category"))
      validParams.category = urlParams.get("category");
    if (urlParams.has("madeIn"))
      validParams.madeIn = urlParams.get("madeIn");
    await this.setParams(
      { ...this.initState().params, ...validParams, ...newParams },
      true
    );
  }
  /**
   * Сброс параметров к начальным
   * @param [newParams] {Object} Новые параметры
   * @return {Promise<void>}
   */
  async resetParams(newParams = {}) {
    const params = { ...this.initState().params, ...newParams };
    await this.setParams(params);
  }
  /**
   * Установка параметров и загрузка списка товаров
   * @param [newParams] {Object} Новые параметры
   * @param [replaceHistory] {Boolean} Заменить адрес (true) или новая запись в истории браузера (false)
   * @returns {Promise<void>}
   */
  async setParams(newParams = {}, replaceHistory = false, hide = false, selected = []) {
    const params = { ...this.getState().params, ...newParams };
    this.setState(
      {
        ...this.getState(),
        params,
        waiting: true
      },
      "Установлены параметры каталога"
    );
    let urlSearch = new URLSearchParams(
      exclude(params, this.initState().params)
    ).toString();
    const url = (window == null ? void 0 : window.location.pathname) + (urlSearch ? `?${urlSearch}` : "") + (window == null ? void 0 : window.location.hash);
    if (!hide) {
      if (replaceHistory) {
        window == null ? void 0 : window.history.replaceState({}, "", url);
      } else {
        window == null ? void 0 : window.history.pushState({}, "", url);
      }
    }
    const apiParams = exclude(
      {
        limit: params.limit,
        skip: (params.page - 1) * params.limit,
        fields: "items(*),count",
        sort: params.sort,
        "search[query]": params.query,
        "search[category]": params.category,
        "search[madeIn]": params.madeIn
      },
      {
        skip: 0,
        "search[query]": "",
        "search[category]": "",
        "search[madeIn]": ""
      }
    );
    const res = await this.services.api.request({
      url: `/api/v1/articles?${new URLSearchParams(apiParams)}`
    });
    if (selected.length > 0) {
      res.data.result.items.map((product) => {
        const filteredProduct = selected.some(
          (item) => product._id === item.id
        );
        if (filteredProduct) {
          return product.selectedGoods = true;
        } else {
          return product;
        }
      });
    }
    this.setState(
      {
        ...this.getState(),
        list: res.data.result.items,
        count: res.data.result.count,
        waiting: false
      },
      "Загружен список товаров из АПИ"
    );
  }
}
class ModalsState extends StoreModule {
  initState() {
    return {
      name: null
    };
  }
  open(name) {
    this.setState({ name }, `Открытие модалки ${name}`);
  }
  close() {
    this.setState({ name: null }, `Закрытие модалки`);
  }
}
class ArticleState extends StoreModule {
  initState() {
    return {
      data: {},
      waiting: false
      // признак ожидания загрузки
    };
  }
  /**
   * Загрузка товаров по id
   * @param id {String}
   * @return {Promise<void>}
   */
  async load(id) {
    this.setState({
      data: {},
      waiting: true
    });
    try {
      const res = await this.services.api.request({
        url: `/api/v1/articles/${id}?fields=*,madeIn(title,code),category(title)`
      });
      this.setState({
        data: res.data.result,
        waiting: false
      }, "Загружен товар из АПИ");
    } catch (e) {
      this.setState({
        data: {},
        waiting: false
      });
    }
  }
}
class LocaleState extends StoreModule {
  initState() {
    return {
      lang: "ru"
    };
  }
  /**
   * Установка кода языка (локали)
   * @param lang
   */
  setLang(lang) {
    this.setState({ lang }, "Установлена локаль");
  }
}
class CategoriesState extends StoreModule {
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {
      list: [],
      waiting: false
    };
  }
  /**
   * Загрузка списка товаров
   */
  async load() {
    this.setState({ ...this.getState(), waiting: true }, "Ожидание загрузки категорий");
    const res = await this.services.api.request({
      url: `/api/v1/categories?fields=_id,title,parent(_id)&limit=*`
    });
    this.setState({
      ...this.getState(),
      list: res.data.result.items,
      waiting: false
    }, "Категории загружены");
  }
}
function simplifyErrors(issues = {}) {
  const result = {};
  for (const issue of issues) {
    const key = issue.path.join(".") || "other";
    if (result[key]) {
      result[key].push(issue.message);
    } else {
      result[key] = [issue.message];
    }
  }
  return result;
}
class SessionState extends StoreModule {
  // config!: IConfig["store"]["modules"]["session"]
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {
      user: {},
      token: null,
      errors: null,
      waiting: true,
      exists: false
    };
  }
  initConfig() {
    return {};
  }
  /**
   * Авторизация (вход)
   * @param data
   * @param onSuccess
   * @returns Promise<void>
   */
  async signIn(data, onSuccess) {
    this.setState(this.initState(), "Авторизация");
    try {
      const res = await this.services.api.request({
        url: "/api/v1/users/sign",
        method: "POST",
        body: JSON.stringify(data)
      });
      if (!res.data.error) {
        this.setState({
          ...this.getState(),
          token: res.data.result.token,
          user: res.data.result.user,
          exists: true,
          waiting: false
        }, "Успешная авторизация");
        window == null ? void 0 : window.localStorage.setItem("token", res.data.result.token);
        this.services.api.setHeader(this.config.tokenHeader, res.data.result.token);
        if (onSuccess)
          onSuccess();
      } else {
        this.setState({
          ...this.getState(),
          errors: simplifyErrors(res.data.error.data.issues),
          waiting: false
        }, "Ошибка авторизации");
      }
    } catch (e) {
      console.error(e);
    }
  }
  /**
   * Отмена авторизации (выход)
   * @returns Promise<void>
   */
  async signOut() {
    try {
      await this.services.api.request({
        url: "/api/v1/users/sign",
        method: "DELETE"
      });
      window == null ? void 0 : window.localStorage.removeItem("token");
      this.services.api.setHeader(this.config.tokenHeader, null);
    } catch (error) {
      console.error(error);
    }
    this.setState({ ...this.initState(), waiting: false });
  }
  /**
   * По токену восстановление сессии
   * @return {Promise<void>}
   */
  async remind() {
    const token = localStorage.getItem("token");
    if (token) {
      this.services.api.setHeader(this.config.tokenHeader, token);
      const res = await this.services.api.request({ url: "/api/v1/users/self" });
      if (res.data.error) {
        window == null ? void 0 : window.localStorage.removeItem("token");
        this.services.api.setHeader(this.config.tokenHeader, null);
        this.setState({
          ...this.getState(),
          exists: false,
          waiting: false
        }, "Сессии нет");
      } else {
        this.setState({
          ...this.getState(),
          token,
          user: res.data.result,
          exists: true,
          waiting: false
        }, "Успешно вспомнили сессию");
      }
    } else {
      this.setState({
        ...this.getState(),
        exists: false,
        waiting: false
      }, "Сессии нет");
    }
  }
  /**
   * Сброс ошибок авторизации
   */
  resetErrors() {
    this.setState({ ...this.initState(), errors: null });
  }
}
class ProfileState extends StoreModule {
  initState() {
    return {
      data: {},
      waiting: false
      // признак ожидания загрузки
    };
  }
  /**
   * Загрузка профиля
   * @return {Promise<void>}
   */
  async load() {
    this.setState({
      data: {},
      waiting: true
    });
    const { data } = await this.services.api.request({ url: `/api/v1/users/self` });
    this.setState({
      data: data.result,
      waiting: false
    }, "Загружен профиль из АПИ");
  }
}
class CatalogModalState extends CatalogState {
  /**
  * Выделение записи по коду
  * @param id
  */
  selectItem(id) {
    this.setState({
      ...this.getState(),
      list: this.getState().list.map((item) => {
        if (item._id === id) {
          return {
            ...item,
            selectedGoods: !item.selectedGoods
          };
        }
        return item;
      })
    });
  }
}
class CountriesState extends StoreModule {
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {
      list: [],
      waiting: false
    };
  }
  /**
   * Загрузка списка стран
   */
  async load() {
    this.setState({ ...this.getState(), waiting: true }, "Ожидание загрузки стран");
    const res = await this.services.api.request({
      url: `/api/v1/countries?lang=ru&limit=228&skip=0&fields=%2A`
    });
    this.setState({
      ...this.getState(),
      list: res.data.result.items,
      waiting: false
    }, "Список стран загружен");
  }
  async search(query) {
    this.setState(
      { ...this.getState(), waiting: true },
      "Ожидание загрузки стран"
    );
    const res = await this.services.api.request({
      url: `/api/v1/countries?search[query]=${query}&fields=items(_id,title,code),count&limit=*`
    });
    if (res.status === 200) {
      this.setState(
        {
          ...this.getState(),
          list: res.data.result.items,
          waiting: false
        },
        "Страны загружены"
      );
    }
  }
  /**
   * Выделение записи 
   * @param id
   */
  selectСountry(id) {
    this.setState({
      ...this.getState(),
      list: this.getState().list.map((item) => {
        if (item._id === id) {
          return {
            ...item,
            selected: !item.selected
          };
        }
        return item;
      })
    });
  }
}
class ChatState extends StoreModule {
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {
      messages: [],
      message: "",
      connected: false,
      statusClearChat: false
    };
  }
  /**
   * Установка соединения
   */
  onConnect() {
    this.services.socket.connect("example.front.ylab.io/chat");
    const socket = this.services.socket.socket;
    socket.onopen = () => {
      this.setState(
        {
          ...this.getState(),
          connected: true
        },
        "Соединение установлено"
      );
      const token = localStorage.getItem("token");
      this.services.socket.send("auth", {
        token
      });
    };
    socket.onmessage = (event) => {
      const messages = JSON.parse(event.data);
      if (messages.method === "auth") {
        this.requestLatestMessages();
      }
      if (messages.method === "last") {
        if ("items" in messages.payload) {
          this.setState({
            ...this.getState(),
            messages: messages.payload.items,
            statusClearChat: false
          });
        }
      }
      if (messages.method === "post") {
        if (!("items" in messages.payload)) {
          this.setState({
            ...this.getState(),
            messages: [
              ...this.getState().messages,
              messages.payload
            ],
            statusClearChat: false
          });
        }
      }
      if (messages.method === "old") {
        if ("items" in messages.payload) {
          this.setState({
            ...this.getState(),
            messages: messages.payload.items
          });
        }
      }
      if (messages.method === "clear") {
        if (!("items" in messages.payload)) {
          this.setState({
            ...this.getState(),
            messages: [],
            statusClearChat: true
          });
        }
      }
    };
    socket.onclose = () => {
      if (this.getState().connected)
        this.onConnect();
      console.log("Socket закрыт");
    };
    socket.onerror = () => {
      console.log("Socket произошла ошибка");
    };
  }
  /**
   * Закрытие WebSocket соединения
   */
  close() {
    this.setState({
      ...this.getState(),
      connected: false
    });
    this.services.socket.close();
  }
  /**
   * Отправка нового сообщения
   */
  newMessage() {
    if (this.services.socket.socket) {
      this.services.socket.send("post", {
        _key: generateUniqueId(),
        text: this.getState().message
      });
    }
  }
  /**
   * Запрос свежих сообщений
   */
  requestLatestMessages() {
    if (this.services.socket.socket) {
      this.services.socket.send("last", {});
    }
  }
  /**
   * Запрос старых сообщений
   */
  requestOldMessage() {
    const id = this.getState().messages[0]._id;
    if (this.services.socket.socket) {
      this.services.socket.send("old", {
        fromId: id
      });
    }
  }
  /**
   * Удаление всех сообщений
   */
  deleteAllMessages() {
    if (this.services.socket.socket) {
      this.services.socket.send("clear", {});
    }
  }
  /**
   * Сохранение нового сообщения
   */
  setMessage(text) {
    this.setState({
      ...this.getState(),
      message: text
    });
  }
  /**
   * Удаление нового сообщения
   */
  deleteMessage() {
    this.setState({
      ...this.getState(),
      message: ""
    });
  }
  // Генерируем искусственную ошибку в сокете
  generateSocketError() {
    const event = new Event("error");
    this.services.socket.socket.dispatchEvent(event);
  }
}
class CanvasState extends StoreModule {
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {
      canvas: null,
      tool: null,
      undoList: [],
      // Хранение выполненных действий на canvas
      redoList: [],
      // Хранение действий на canvas, которые отменили
      nameTool: "freeDraw",
      // Название инструмента
      figures: []
    };
  }
  /**
   * Добавление canvas
   */
  setCannvas(canvas) {
    this.setState({
      ...this.getState(),
      canvas
    });
  }
  /**
   * Добавление инструмента
   */
  setTool(tool, name) {
    this.setState({
      ...this.getState(),
      tool,
      nameTool: name
    });
  }
  /**
   * Изменение цвета 
   */
  setFillColor(color) {
    const currentTool = this.getState().tool;
    if (currentTool)
      currentTool.fillColor = color;
    this.setState({
      ...this.getState(),
      tool: currentTool
    });
  }
  /**
   * Изменение обводки 
   */
  setStrokeColor(color) {
    const currentTool = this.getState().tool;
    if (currentTool)
      currentTool.strokeColor = color;
    this.setState({
      ...this.getState(),
      tool: currentTool
    });
  }
  /**
   * Изменение ширины
   */
  setLineWidth(width) {
    const currentTool = this.getState().tool;
    if (currentTool)
      currentTool.lineWidth = width;
    this.setState({
      ...this.getState(),
      tool: currentTool
    });
  }
  /**
   * Добавление действий в массив "undoList"
   */
  pushToUndo(data) {
    this.setState({
      ...this.getState(),
      undoList: [...this.getState().undoList, data]
    });
  }
  /**
   * Добавление действий, которые отменили
   */
  pushToRedo(data) {
    this.setState({
      ...this.getState(),
      redoList: [...this.getState().redoList, data]
    });
  }
  /**
   * Отмена последнего действия
   */
  undo() {
    let ctx = this.getState().canvas.getContext("2d");
    if (this.getState().undoList.length > 0) {
      let dataUrl = this.getState().undoList.pop();
      this.getState().redoList.push(this.getState().canvas.toDataURL());
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        ctx.clearRect(0, 0, this.getState().canvas.width, this.getState().canvas.height);
        ctx.drawImage(img, 0, 0, this.getState().canvas.width, this.getState().canvas.height);
      };
    } else {
      ctx.clearRect(0, 0, this.getState().canvas.width, this.getState().canvas.height);
    }
  }
  /**
   * Возврат последнего действия
   */
  redo() {
    let ctx = this.getState().canvas.getContext("2d");
    if (this.getState().redoList.length > 0) {
      let dataUrl = this.getState().redoList.pop();
      this.getState().undoList.push(this.getState().canvas.toDataURL());
      let img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        ctx.clearRect(0, 0, this.getState().canvas.width, this.getState().canvas.height);
        ctx.drawImage(img, 0, 0, this.getState().canvas.width, this.getState().canvas.height);
      };
    }
  }
  /**
   * Сохранение фигур
   */
  setFigures() {
    const figures = this.getState().tool.allFiguresTool;
    this.setState({
      ...this.getState(),
      figures: [...this.getState().figures, ...figures]
    });
  }
}
const modules = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  article: ArticleState,
  basket: BasketState,
  canvas: CanvasState,
  catalog: CatalogState,
  catalog_modal: CatalogModalState,
  categories: CategoriesState,
  chat: ChatState,
  countries: CountriesState,
  locale: LocaleState,
  modals: ModalsState,
  profile: ProfileState,
  session: SessionState
}, Symbol.toStringTag, { value: "Module" }));
class Store {
  constructor(services, config2 = {}, initState = {}) {
    this.services = services;
    this.config = config2;
    this.listeners = [];
    this.state = initState;
    this.initialStateFromServer = { ...initState };
    this.actions = {};
    const keys = Object.keys(modules);
    for (const name of keys) {
      this.create(name);
      const storeModule = this.actions[name];
      console.log("storeModule", storeModule);
    }
    console.log("this.initialStateFromServer", this.initialStateFromServer);
  }
  create(name) {
    var _a;
    const b = modules[name];
    const a = new b(this, name, ((_a = this.config) == null ? void 0 : _a.modules.session) || {});
    this.actions[name] = a;
    this.state[name] = this.actions[name].initState();
  }
  /**
   * Удаление копии стейта
   */
  delete(name) {
    delete this.actions[name];
    delete this.state[name];
  }
  /**
   * Подписка слушателя на изменения состояния
   * @param listener {Function}
   * @returns {Function} Функция отписки
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((item) => item !== listener);
    };
  }
  /**
   * Выбор состояния
   * @returns {{
   * basket: Object,
   * catalog: Object,
   * modals: Object,
   * article: Object,
   * locale: Object,
   * categories: Object,
   * session: Object,
   * profile: Object,
   * }}
   */
  getState() {
    return this.state;
  }
  /**
   * Установка состояния
   * @param newState {Object}
   */
  setState(newState, description = "setState") {
    if (this.config.log) {
      console.group(
        `%c${"store.setState"} %c${description}`,
        `color: ${"#777"}; font-weight: normal`,
        `color: ${"#333"}; font-weight: bold`
      );
      console.log(`%c${"prev:"}`, `color: ${"#d77332"}`, this.state);
      console.log(`%c${"next:"}`, `color: ${"#2fa827"}`, newState);
      console.groupEnd();
    }
    this.state = newState;
    for (const listener of this.listeners)
      listener(this.state);
  }
}
function formatProdErrorMessage(code) {
  return "Minified Redux error #" + code + "; visit https://redux.js.org/Errors?code=" + code + " for the full message or use the non-minified dev environment for full errors. ";
}
var $$observable = function() {
  return typeof Symbol === "function" && Symbol.observable || "@@observable";
}();
var randomString = function randomString2() {
  return Math.random().toString(36).substring(7).split("").join(".");
};
var ActionTypes = {
  INIT: "@@redux/INIT" + randomString(),
  REPLACE: "@@redux/REPLACE" + randomString(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
  }
};
function isPlainObject(obj) {
  if (typeof obj !== "object" || obj === null)
    return false;
  var proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
}
function createStore(reducer2, preloadedState, enhancer) {
  var _ref2;
  if (typeof preloadedState === "function" && typeof enhancer === "function" || typeof enhancer === "function" && typeof arguments[3] === "function") {
    throw new Error(formatProdErrorMessage(0));
  }
  if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
    enhancer = preloadedState;
    preloadedState = void 0;
  }
  if (typeof enhancer !== "undefined") {
    if (typeof enhancer !== "function") {
      throw new Error(formatProdErrorMessage(1));
    }
    return enhancer(createStore)(reducer2, preloadedState);
  }
  if (typeof reducer2 !== "function") {
    throw new Error(formatProdErrorMessage(2));
  }
  var currentReducer = reducer2;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  function getState() {
    if (isDispatching) {
      throw new Error(formatProdErrorMessage(3));
    }
    return currentState;
  }
  function subscribe(listener) {
    if (typeof listener !== "function") {
      throw new Error(formatProdErrorMessage(4));
    }
    if (isDispatching) {
      throw new Error(formatProdErrorMessage(5));
    }
    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }
      if (isDispatching) {
        throw new Error(formatProdErrorMessage(6));
      }
      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }
  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error(formatProdErrorMessage(7));
    }
    if (typeof action.type === "undefined") {
      throw new Error(formatProdErrorMessage(8));
    }
    if (isDispatching) {
      throw new Error(formatProdErrorMessage(9));
    }
    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }
    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }
    return action;
  }
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== "function") {
      throw new Error(formatProdErrorMessage(10));
    }
    currentReducer = nextReducer;
    dispatch({
      type: ActionTypes.REPLACE
    });
  }
  function observable() {
    var _ref;
    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe2(observer) {
        if (typeof observer !== "object" || observer === null) {
          throw new Error(formatProdErrorMessage(11));
        }
        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }
        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe
        };
      }
    }, _ref[$$observable] = function() {
      return this;
    }, _ref;
  }
  dispatch({
    type: ActionTypes.INIT
  });
  return _ref2 = {
    dispatch,
    subscribe,
    getState,
    replaceReducer
  }, _ref2[$$observable] = observable, _ref2;
}
function assertReducerShape(reducers2) {
  Object.keys(reducers2).forEach(function(key) {
    var reducer2 = reducers2[key];
    var initialState2 = reducer2(void 0, {
      type: ActionTypes.INIT
    });
    if (typeof initialState2 === "undefined") {
      throw new Error(formatProdErrorMessage(12));
    }
    if (typeof reducer2(void 0, {
      type: ActionTypes.PROBE_UNKNOWN_ACTION()
    }) === "undefined") {
      throw new Error(formatProdErrorMessage(13));
    }
  });
}
function combineReducers(reducers2) {
  var reducerKeys = Object.keys(reducers2);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];
    if (typeof reducers2[key] === "function") {
      finalReducers[key] = reducers2[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);
  var shapeAssertionError;
  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }
  return function combination(state, action) {
    if (state === void 0) {
      state = {};
    }
    if (shapeAssertionError) {
      throw shapeAssertionError;
    }
    var hasChanged = false;
    var nextState = {};
    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer2 = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer2(previousStateForKey, action);
      if (typeof nextStateForKey === "undefined") {
        action && action.type;
        throw new Error(formatProdErrorMessage(14));
      }
      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state;
  };
}
function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }
  if (funcs.length === 0) {
    return function(arg) {
      return arg;
    };
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce(function(a, b) {
    return function() {
      return a(b.apply(void 0, arguments));
    };
  });
}
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }
  return function(createStore2) {
    return function() {
      var store = createStore2.apply(void 0, arguments);
      var _dispatch = function dispatch() {
        throw new Error(formatProdErrorMessage(15));
      };
      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch() {
          return _dispatch.apply(void 0, arguments);
        }
      };
      var chain = middlewares.map(function(middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose.apply(void 0, chain)(store.dispatch);
      return _objectSpread(_objectSpread({}, store), {}, {
        dispatch: _dispatch
      });
    };
  };
}
function createThunkMiddleware(extraArgument) {
  var middleware = function middleware2(_ref) {
    var dispatch = _ref.dispatch, getState = _ref.getState;
    return function(next) {
      return function(action) {
        if (typeof action === "function") {
          return action(dispatch, getState, extraArgument);
        }
        return next(action);
      };
    };
  };
  return middleware;
}
var thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;
const initialState$1 = {
  data: {},
  waiting: false
  // признак ожидания загрузки
};
function reducer$1(state = initialState$1, action) {
  switch (action.type) {
    case "article/load-start":
      return { ...state, data: {}, waiting: true };
    case "article/load-success":
      return { ...state, data: action.payload.data, waiting: false };
    case "article/load-error":
      return { ...state, data: {}, waiting: false };
    default:
      return state;
  }
}
const initialState = {
  modals: [],
  activeModal: false,
  statusCatalogModal: null
};
function reducer(state = initialState, action) {
  switch (action.type) {
    case "modal/open":
      return { ...state, modals: [...state.modals, action.payload] };
    case "modal/close":
      return { ...state, modals: action.payload.modals };
    case "modal/active":
      return { ...state, activeModal: action.payload.status };
    case "modal/status/catalog":
      return { ...state, statusCatalogModal: action.payload.status };
    default:
      return state;
  }
}
const reducers = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  article: reducer$1,
  modals: reducer
}, Symbol.toStringTag, { value: "Module" }));
function createStoreRedux(services, config2 = {}) {
  return createStore(
    combineReducers(reducers),
    void 0,
    applyMiddleware(thunk.withExtraArgument(services))
  );
}
class Services {
  constructor(config2, initState = {}) {
    this.config = config2;
    this.initState = initState;
  }
  /**
   * Сервис АПИ
   * @returns {APIService}
   */
  get api() {
    if (!this._api) {
      this._api = new APIService(this, this.config.api);
    }
    return this._api;
  }
  /**
     * Сервис WebSocket
     * @returns {WebSocketService}
     */
  get socket() {
    if (!this._socket) {
      this._socket = new WebSocketService(this, this.config.api);
    }
    return this._socket;
  }
  /**
   * Сервис Store
   * @returns {Store}
   */
  get store() {
    if (!this._store) {
      this._store = new Store(this, this.config.store, this.initState);
    }
    return this._store;
  }
  /**
   * Redux store
   */
  get redux() {
    if (!this._redux) {
      this._redux = createStoreRedux(this, this.config.redux);
    }
    return this._redux;
  }
}
const isProduction = true;
const config = {
  store: {
    // Логировать установку состояния?
    log: !isProduction,
    // Настройки модулей состояния
    modules: {
      session: {
        // Названия токена в АПИ
        tokenHeader: "X-Token"
      }
    }
  },
  api: {
    baseUrl: ""
  },
  socket: {
    baseUrl: ""
  },
  redux: {}
};
const render = ({ path, data }) => {
  const services = new Services(config, data);
  console.log("в entry-server data===", data);
  return renderToString(
    /* @__PURE__ */ jsx(Provider, { store: services.redux, children: /* @__PURE__ */ jsx(ServicesContext.Provider, { value: services, children: /* @__PURE__ */ jsx(I18nProvider, { children: /* @__PURE__ */ jsx(StaticRouter, { location: path, children: /* @__PURE__ */ jsx(App, {}) }) }) }) })
  );
};
export {
  render
};
//# sourceMappingURL=entry-server.js.map
