import { Suspense } from 'react';
import GlobalLoader from '@src/components/global-loader';

function withLoader(WrappedComponent: React.ComponentType) {
  return (props?: object) => (
    <Suspense fallback={<GlobalLoader />}>
      <WrappedComponent {...props} />;
    </Suspense>
  );
}

export default withLoader;
