import { PaymentMethod } from '@bigcommerce/checkout-sdk';
import { find, noop } from 'lodash';
import React, { memo, useCallback, useMemo, FunctionComponent } from 'react';

import { connectFormik, ConnectFormikProps } from '../../common/form';
import { Checklist, ChecklistItem } from '../../ui/form';

import getUniquePaymentMethodId, { parseUniquePaymentMethodId } from './getUniquePaymentMethodId';
import { default as PaymentMethodComponent } from './PaymentMethod';
import PaymentMethodTitle from './PaymentMethodTitle';

export interface PaymentMethodListProps {
    isEmbedded?: boolean;
    isInitializingPayment?: boolean;
    isUsingMultiShipping?: boolean;
    methods: PaymentMethod[];
    submitForm?(): void;
    onSelect?(method: PaymentMethod): void;
    onUnhandledError?(error: Error): void;
}

function getPaymentMethodFromListValue(methods: PaymentMethod[], value: string): PaymentMethod {
    const { gatewayId: gateway, methodId: id } = parseUniquePaymentMethodId(value);
    const method = gateway ? find(methods, { gateway, id }) : find(methods, { id });

    if (!method) {
        throw new Error(`Unable to find payment method with id: ${id}`);
    }

    return method;
}

const PaymentMethodList: FunctionComponent<
    PaymentMethodListProps &
    ConnectFormikProps<{ paymentProviderRadio?: string }>
> = ({
    formik: { values },
    isEmbedded,
    isInitializingPayment,
    isUsingMultiShipping,
    methods,
    onSelect = noop,
    onUnhandledError,
    submitForm,
}) => {
    const handleSelect = useCallback((value: string) => {
        onSelect(getPaymentMethodFromListValue(methods, value));
    }, [
        methods,
        onSelect,
    ]);

    return <Checklist
        defaultSelectedItemId={ values.paymentProviderRadio }
        isDisabled={ isInitializingPayment }
        name="paymentProviderRadio"
        onSelect={ handleSelect }
    >
        { methods.map(method => {
            const value = getUniquePaymentMethodId(method.id, method.gateway);

            return (
                <PaymentMethodListItem
                    isDisabled={ isInitializingPayment }
                    isEmbedded={ isEmbedded }
                    isUsingMultiShipping={ isUsingMultiShipping }
                    key={ value }
                    method={ method }
                    onUnhandledError={ onUnhandledError }
                    submitForm={ submitForm }
                    value={ value }
                />
            );
        }) }
    </Checklist>;
};

interface PaymentMethodListItemProps {
    isDisabled?: boolean;
    isEmbedded?: boolean;
    isUsingMultiShipping?: boolean;
    method: PaymentMethod;
    value: string;
    submitForm?(): void;
    onUnhandledError?(error: Error): void;
}

const PaymentMethodListItem: FunctionComponent<PaymentMethodListItemProps> = ({
    isDisabled,
    isEmbedded,
    isUsingMultiShipping,
    method,
    onUnhandledError,
    submitForm,
    value,
}) => {
    const renderPaymentMethod = useMemo(() => (
        <PaymentMethodComponent
            isEmbedded={ isEmbedded }
            isUsingMultiShipping={ isUsingMultiShipping }
            method={ method }
            onUnhandledError={ onUnhandledError }
            submitForm={ submitForm }
        />
    ), [
        isEmbedded,
        isUsingMultiShipping,
        submitForm,
        method,
        onUnhandledError,
    ]);

    const renderPaymentMethodTitle = useCallback((isSelected: boolean) => (
        <PaymentMethodTitle
            isSelected={ isSelected }
            method={ method }
        />
    ), [method]);

    return (
        <ChecklistItem
            content={ renderPaymentMethod }
            htmlId={ `radio-${value}` }
            isDisabled={ isDisabled }
            label={ renderPaymentMethodTitle }
            value={ value }
        />
    );
};

export default connectFormik(memo(PaymentMethodList));
