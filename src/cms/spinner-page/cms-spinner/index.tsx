import { memo } from "react";
import TopHead from "../../../containers/top-head";
import SpinnerLayout from "../../SpinnerLayout";
import CmsLayout from "../../cms-layout";
import CmsSider from "../../cms-sider";

function CMSSpinner() {
  return (
    <CmsLayout>
      <CmsSider />
      <TopHead />
      <SpinnerLayout />
    </CmsLayout>
  )
}

export default memo(CMSSpinner);
