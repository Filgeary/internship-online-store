import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import useStore from '@src/hooks/use-store'
import AdminLayout from '@src/components/admin'
import useTranslate from '@src/hooks/use-translate'
import menu from '@src/utils/menu'
import useSelector from '@src/hooks/use-selector'
import { useDispatch, useSelector as useSelectorRedux } from 'react-redux'
import shallowequal from 'shallowequal'
import categories from '@src/utils/sidebar_categories'
import { StoreState } from '@src/store/types'
import useInit from '@src/hooks/use-init'
import * as Icons from '@ant-design/icons'
import { MenuInfo } from 'rc-menu/lib/interface'
import modalsActions from '@src/store-redux/modals/actions'
import generateUniqueId from '@src/utils/unicque_id'
import articleActions from '@src/store-redux/article/actions'
import { useNavigate } from 'react-router-dom'
import { DataType } from './table'

const { AppstoreOutlined, FilterOutlined, GlobalOutlined } = Icons

const Admin = () => {
  const { t, setLang } = useTranslate()
  const store = useStore()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [openopenDrawer, setOpenopenDrawer] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [product, setProduct] = useState<DataType[]>([])

  const select = useSelector((state: StoreState) => ({
    list: state.catalog.list,
    categories: state.categories.list,
    exists: state.session.exists,
  }))

  // Получаем товары с описанием
  const selectRedux = useSelectorRedux(
    (state: any) => ({
      list: state.article.all,
    }),
    shallowequal,
  )

  useInit(
    async () => {
      await Promise.all([
        store.actions.catalog.initParams(),
        store.actions.categories.load(),
        store.actions.countries.load(),
      ])
    },
    [],
    true,
  )

  const callbacks = {
    // Клик на пункт меню в Header
    onClickMenuTop: useCallback(
      (event: MenuInfo) => {
        const e = event as unknown as { domEvent: { target: { innerText: any } } }
        const nameMenu = e.domEvent.target.innerText
        if (nameMenu === 'Главная' || nameMenu === 'Main')
          navigate('/', { state: { back: location.pathname } })
        if (nameMenu === 'Чат' || nameMenu === 'Chat')
          navigate('/chat', { state: { back: location.pathname } })
        if (nameMenu === 'Профиль' || nameMenu === 'Profile')
          navigate('/profile', { state: { back: location.pathname } })
        if (nameMenu === 'Графический редактор' || nameMenu === 'Graphics editor')
          navigate('/drawing', { state: { back: location.pathname } })
        if (nameMenu === 'Вход' || nameMenu === 'Sign In')
          navigate('/login', { state: { back: location.pathname } })
        if (nameMenu === 'Выход' || nameMenu === 'Sign Out') store.actions.session.signOut()
        if (nameMenu === 'Корзина' || nameMenu === 'Cart') {
          dispatch(modalsActions.open({ name: 'basket', id: generateUniqueId() }))
          dispatch(modalsActions.changeActiveModal(true))
        }
      },
      [store],
    ),
    // Клик на пункт меню в sidebar
    onClickMenuSidebar: useCallback(
      (event: MenuInfo) => {
        const e = event as unknown as { domEvent: { target: { innerText: any } } }
        const nameMenu = e.domEvent.target.innerText
        nameMenu === 'Русский' || (nameMenu === 'Russian' && setLang('ru'))
        nameMenu === 'English' && setLang('en')
      },
      [store],
    ),
    // Открыть боковую панель редактирования
    showDrawer: useCallback(
      (id: string) => {
        setOpenopenDrawer(true)
        setSelectedId(id)
      },
      [setOpenopenDrawer],
    ),
    // Закрыть боковую панель редактирования
    onCloseDrawer: useCallback(() => {
      setOpenopenDrawer(false)
    }, [setOpenopenDrawer]),
    // Закрыть боковую панель редактирования
    onSubmit: useCallback(
      (nameValue: string, priceValue: number | string, descriptionValue: string) => {
        store.actions.catalog.productEditing({
          id: selectedId,
          title: nameValue,
          description: descriptionValue,
          price: Number(priceValue),
        })
        setOpenopenDrawer(false)
        const arrayId = select.list.map(item => {
          return item._id
        })
        dispatch(articleActions.loadAll(arrayId) as any)
      },
      [selectedId],
    ),
  }

  const menuTop = menu([
    { label: t('menu.main') },
    { label: t('menu.chat') },
    { label: t('menu.profile') },
    { label: t('menu.editor') },
    { label: t('basket.title') },
    { label: select.exists ? t('session.signOut') : t('session.signIn') },
  ])

  const sidebarCategories = menu([
    ...categories(select.categories, <AppstoreOutlined />),
    { label: 'Фильтры', icon: <FilterOutlined /> },
    { label: 'Страны', icon: <GlobalOutlined /> },
    {
      label: t('menu.settings'),
      icon: <Icons.SettingOutlined />,
      children: [
        {
          label: 'Перевод',
          children: [{ label: t('menu.ru') }, { label: t('menu.en') }],
        },
        { label: 'Тема' },
      ],
    },
  ])

  useEffect(() => {
    // Получаем id товаров
    const arrayId = select.list.map(item => {
      return item._id
    })
    if (select.list.length > 0) dispatch(articleActions.loadAll(arrayId) as any)
  }, [select.list])

  useEffect(() => {
    if (selectRedux.list.length > 0) {
      const data: DataType[] = selectRedux.list.map((item: any) => ({
        key: item._id,
        name: item.title,
        description: item.description,
        manufacturer: item.madeIn.title,
        category: item.category.title,
        price: item.price,
      }))

      setProduct(data)
    }
  }, [selectRedux.list])

  return (
    <>
      <AdminLayout
        product={product}
        openopenDrawer={openopenDrawer}
        onCloseDrawer={callbacks.onCloseDrawer}
        showDrawer={callbacks.showDrawer}
        menu={menuTop}
        sidebarCategories={sidebarCategories}
        onClickMenuTop={callbacks.onClickMenuTop}
        onClickMenuSidebar={callbacks.onClickMenuSidebar}
        onSubmit={callbacks.onSubmit}
      />
      <button
        onClick={() => callbacks.onSubmit('nameValue', 10, 'descriptionValue')}
        style={{ position: 'absolute' }}
      >
        button
      </button>
    </>
  )
}

export default memo(Admin)
