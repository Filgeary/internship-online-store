import type { ThemeConfig } from 'antd';
import { ConfigProvider } from 'antd';

import Admin from '@src/admin';

const themeToken: ThemeConfig['token'] = {
  fontFamily: 'system-ui',
  fontWeightStrong: 500,
  fontSize: 16,
};

const componentsToken: ThemeConfig['components'] = {
  Typography: {},
};

const AdminPage = () => {
  return (
    <ConfigProvider theme={{ token: themeToken, components: componentsToken }}>
      <Admin />
    </ConfigProvider>
  );
};

export default AdminPage;
