import React, { FC, memo, useState } from 'react'
import { cn as bem } from '@bem-react/classname'
import Img from '../../assets/images/logo.png'
import type { MenuProps } from 'antd'
import { Breadcrumb, Layout, Menu, theme, Image, Space, Input } from 'antd'
import { MenuInfo } from 'rc-menu/lib/interface'
import type { SearchProps } from 'antd/es/input/Search'
import _Table, { DataType } from '@src/app/admin/table'

import './style.css'
import _Drawer from './drawer'
import { IResult } from '@src/store/types'

const { Header, Content, Sider } = Layout
const { Search } = Input

interface IAdminLayout {
  menu: MenuProps['items']
  sidebarCategories: MenuProps['items']
  onClickMenuTop: (event: MenuInfo) => void
  onClickMenuSidebar: (event: MenuInfo) => void
  showDrawer: (id: string) => void
  onCloseDrawer: () => void
  onSubmit: (nameValue: string, priceValue: number | string, descriptionValue: string) => void
  openopenDrawer: boolean
  product: DataType[]
}

const AdminLayout: FC<IAdminLayout> = memo(
  ({
    product,
    menu,
    sidebarCategories,
    onClickMenuTop,
    onClickMenuSidebar,
    showDrawer,
    onCloseDrawer,
    onSubmit,
    openopenDrawer,
  }) => {
    const [collapsed, setCollapsed] = useState(false)

    const cn = bem('AdminLayout')

    const {
      token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken()

    const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value)

    return (
      <Layout className={cn()}>
        <Header className={cn('header')}>
          <div className={cn('demo-logo')}>
            <Image src={Img} preview={false} />
          </div>
          <Menu
            onClick={onClickMenuTop}
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            items={menu}
            style={{ flex: 1, minWidth: 0 }}
          />
        </Header>
        <Layout>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={value => setCollapsed(value)}
            width={250}
            style={{ background: colorBgContainer }}
          >
            <Search
              placeholder="Поиск"
              onSearch={onSearch}
              style={{ width: 210, margin: 20, display: collapsed ? 'none' : 'block' }}
            />
            <Menu
              onClick={onClickMenuSidebar}
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
              items={sidebarCategories}
            />
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb
              style={{ margin: '16px 0' }}
              items={[{ title: <a href="/admin">Админка</a> }]}
            />
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <_Table showDrawer={showDrawer} product={product}/>
              <_Drawer onClose={onCloseDrawer} open={openopenDrawer} onSubmit={onSubmit}/>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  },
)

export default AdminLayout
