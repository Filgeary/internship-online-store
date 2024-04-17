import React, { memo } from "react";
import { Layout, theme } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import './style.css'

type CMSLayoutPropsType = {
  children: React.ReactNode[];
}

function CMSLayout({children}: CMSLayoutPropsType) {
  // const [bread, setBread] = useState<string[]>([])
  // const onclick = (item: any) => {
  //   navigate([...item.keyPath].reverse().join('/'), {state: {back: location.pathname}});
  //   setBread(item.keyPath);
  // };
  // let breadItems = bread.map(i => {
  //   return { title: <NavLink to="">{i}</NavLink> }
  // })
  // breadItems.unshift({ title: <NavLink to="/admin">Home</NavLink>})

  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();


  return (
    <Layout style={{minHeight: "100vh"}}>
      {children[0]}
      <Layout>
        <Header style={{padding: "0 28px", backgroundColor: "transparent"}}>
          {children[1]}
        </Header>

          <Content style={{ padding: '0 48px' }}>
            <div style={{padding: "5px" ,background: colorBgContainer, borderRadius: borderRadiusLG}}>
              {children[2]}
            </div>
          </Content>

        <Footer style={{ textAlign: 'center' }}>
          {children[3]}
          Ant Design CMS created by Anton {new Date().getFullYear()} for YLAB internship
        </Footer>
      </Layout>
    </Layout>
  );
}

export default memo(CMSLayout);
