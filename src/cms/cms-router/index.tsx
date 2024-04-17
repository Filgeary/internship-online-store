import { Suspense, lazy, memo } from "react";
import { Route, Routes } from "react-router-dom";
import CmsSpinner from "../spinner-page/cms-spinner";
import CmsListPage from "../cms-list-page";
import CmsArticle from "../cms-article";

const CmsCatalog = lazy(() => import("../cms-catalog-page/cms-catalog/index"));
const CMSHome = lazy(() => import("../home-page/cms-home"));

function CMSRouter() {
  return (
    <Suspense fallback={<CmsSpinner />}>
      <Routes>
        <Route path="/" element={<CMSHome />} />
        <Route path="/spinner" element={<CmsSpinner />} />
        <Route path="/list" element={<CmsListPage />} />
        <Route path="/catalog" element={<CmsCatalog />} />
        <Route path="/test" element={<CmsArticle />} />
        {/* <Route index element={<CmsHome />}/>

    <Route path="Catalog/Goods" element={(
      <Suspense fallback={<CmsSpinner />}>
        <CmsCatalogTable />
      </Suspense>
    )}/>

    <Route path="Catalog/Categories" element={<div>Categories</div>}/>
    <Route path="Catalog/Countries" element={<div>Countries</div>}/>
    <Route path="2" element={<CmsCatalog />}/>
    <Route path="Spinner" element={<CmsSpinner />}/> */}
      </Routes>
    </Suspense>
  );
}

export default memo(CMSRouter);
