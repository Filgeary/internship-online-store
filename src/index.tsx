import './entry-client';

/*
  It is uncommon to call root.render on a hydrated root. Usually, you’ll update state inside one of the components instead.
  https://react.dev/reference/react-dom/client/hydrateRoot#root-render

  ---

  Dan Abramov: There is no need for a further render call.
  https://github.com/facebook/react/issues/24610
*/
