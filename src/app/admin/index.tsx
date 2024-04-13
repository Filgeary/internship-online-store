import { Sidebar } from "@src/admin/layout/sidebar";
import TopHead from "@src/containers/top-head";
import useInit from "@src/hooks/use-init";
import useStore from "@src/hooks/use-store";
import Layout, { Content, Header } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";

function AdminPanel () {
  const store = useStore();

  useInit(() => {
    store.make("catalog_admin", "catalog");
    store.make("categories_admin", "categories");
    store.make("countries_admin", "countries");
    Promise.all([
      store.actions.users.load(),
      store.actions["catalog_admin"]?.initParams(),
      store.actions["categories_admin"]?.load(),
      store.actions["countries_admin"]?.load(),
      store.actions.comments.load(),
    ]);
    return () => {
      store.delete("catalog_admin");
      store.delete("categories_admin");
      store.delete("countries_admin");
    }
  }, [])

  return (
    <Layout>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          padding: "0 15px",
        }}
      >
        <TopHead />
      </Header>
      <Layout>
        <Sidebar />
        <Layout style={{ marginLeft: 60 }}>
          <Content style={{ padding: "0 20px", minHeight: "100vh" }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default AdminPanel;
