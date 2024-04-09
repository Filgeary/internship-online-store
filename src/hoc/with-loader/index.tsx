import GlobalLoader from '@src/components/global-loader';
import { Suspense } from 'react';

function withLoader(WrappedComponent: React.ComponentType) {
  return (props?: object) => (
    <Suspense fallback={<GlobalLoader />}>
      <WrappedComponent {...props} />;
    </Suspense>
  );
}

export default withLoader;
