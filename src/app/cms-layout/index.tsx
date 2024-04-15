import { Suspense, lazy, memo } from "react";
import './style.css';
import { Route, Routes } from "react-router-dom";
import Cms from "../../containers/cms";
import CmsSpinner from "../../components/cms-spinner";
import CmsHome from "../../components/cms-home";

const CmsCatalogTable = lazy(() => import("../../containers/cms-catalog-table"))
const CmsCatalog = lazy(() => import("../../containers/cms-catalog"))

function CMSLayout() {
  return (
    <Routes>
      <Route path="/" element={<Cms />}>
          <Route index element={<CmsHome />}/>

          <Route path="Catalog/Goods" element={(
            <Suspense fallback={<CmsSpinner />}>
              <CmsCatalogTable />
            </Suspense>
          )}/>

          <Route path="Catalog/Categories" element={<div>Categories</div>}/>
          <Route path="Catalog/Countries" element={<div>Countries</div>}/>
          <Route path="2" element={<CmsCatalog />}/>
          <Route path="Spinner" element={<CmsSpinner />}/>

      </Route>
    </Routes>
  )
}

export default memo(CMSLayout);
