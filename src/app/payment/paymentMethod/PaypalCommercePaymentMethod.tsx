import React, { useCallback, FunctionComponent } from 'react';
import { Omit } from 'utility-types';

import HostedWidgetPaymentMethod, { HostedWidgetPaymentMethodProps } from './HostedWidgetPaymentMethod';

export type PaypalCommercePaymentMethod = Omit<HostedWidgetPaymentMethodProps, 'containerId' | 'disableSubmitButton'>;

const PaypalCommercePaymentMethod: FunctionComponent<PaypalCommercePaymentMethod> = ({
      initializePayment,
      submitForm,
      ...rest
  }) => {
    const initializePayPalComemrcePayment = useCallback(options => initializePayment({
        ...options,
        paypalcommerce: {
            container: '#paymentButtonWidget',
            submitForm: submitForm,
        },
    }), [initializePayment]);

    return <HostedWidgetPaymentMethod
        { ...rest }
        containerId="paymentWidget"
        initializePayment={ initializePayPalComemrcePayment }
    />;
};

export default PaypalCommercePaymentMethod;
