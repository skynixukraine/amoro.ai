import { useContext } from 'react';
import { PageContext, PageContextProvider } from './PageContext';

export {
  PageContext, PageContextProvider
}
export const usePageContext = () => useContext(PageContext);