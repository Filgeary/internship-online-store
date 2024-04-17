import { memo } from "react";
import TopHead from "../../../containers/top-head";
import CmsHomeContent from "../cms-home-content";
import CmsLayout from "../../cms-layout";
import CmsSider from "../../cms-sider";

function CMSHome() {
  return (
    <CmsLayout>
      <CmsSider />
      <TopHead />
      <CmsHomeContent />
    </CmsLayout>
  )
}

export default memo(CMSHome)
