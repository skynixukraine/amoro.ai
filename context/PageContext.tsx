import { standardFormDefaultValues, layoutValues } from '@/common/constants';
import {
  SpeakerFormValuesType,
  StandardFormValuesType,
  TemplatContextType,
  VideoFormValuesType,
  OptimizerFormFieldType,
  LayoutType,
} from '@/common/types';
import React, { useCallback, useEffect, useState } from 'react';

interface IPageContextProps {
  templateData: TemplatContextType;
  updatePageContext: (data: any) => void;
}

export const defaultPageContextValue: TemplatContextType = {
  formData: standardFormDefaultValues,
  optimizer: { formData: [], emailContent: '' },
  layout: layoutValues,
  export: { subject: '', htmlContent: '' },
  currentId: NaN,
};

export const PageContext = React.createContext<IPageContextProps>({
  templateData: defaultPageContextValue,
  updatePageContext: () => {},
});

export const PageContextProvider = (props: {
  formData:
    | StandardFormValuesType
    | VideoFormValuesType
    | SpeakerFormValuesType;
  optimizer: { formData: Array<OptimizerFormFieldType>; emailContent: string };
  layout: LayoutType;
  currentId?: number;
  children:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
}) => {
  const [context, setContext] = useState<TemplatContextType>({
    ...defaultPageContextValue,
    formData: props.formData,
    optimizer: props.optimizer || undefined,
    layout: props.layout || undefined,
    currentId: props.currentId || NaN,
  });

  const updatContext = (contextValues: any = defaultPageContextValue) => {
    setContext({
      ...context,
      ...contextValues,
    });
  };

  return (
    <PageContext.Provider
      value={{
        templateData: context,
        updatePageContext: updatContext,
      }}
    >
      {props.children}
    </PageContext.Provider>
  );
};
