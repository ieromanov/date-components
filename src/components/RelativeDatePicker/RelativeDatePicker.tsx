'use client';

import React from 'react';

import {
    Calendar as CalendarIcon,
    Clock as ClockIcon,
    Function as FunctionIcon,
} from '@gravity-ui/icons';
import {Button, Icon, Popup, TextInput, useForkRef, useMobile} from '@gravity-ui/uikit';

import {block} from '../../utils/cn';
import {Calendar} from '../Calendar';
import type {CalendarProps} from '../Calendar';
import {DateField} from '../DateField';
import {MobileCalendar} from '../DatePicker/MobileCalendar';
import {StubButton} from '../DatePicker/StubButton';
import {HiddenInput} from '../HiddenInput/HiddenInput';
import type {
    AccessibilityProps,
    DomProps,
    FocusableProps,
    InputDOMProps,
    KeyboardEvents,
    PopupStyleProps,
    StyleProps,
    TextInputProps,
} from '../types';

import {useRelativeDatePickerProps} from './hooks/useRelativeDatePickerProps';
import {useRelativeDatePickerState} from './hooks/useRelativeDatePickerState';
import type {RelativeDatePickerStateOptions, Value} from './hooks/useRelativeDatePickerState';

import './RelativeDatePicker.scss';

const b = block('relative-date-picker');

export interface RelativeDatePickerProps
    extends RelativeDatePickerStateOptions,
        TextInputProps,
        FocusableProps,
        KeyboardEvents,
        DomProps,
        InputDOMProps,
        StyleProps,
        AccessibilityProps,
        PopupStyleProps {
    children?: (props: CalendarProps) => React.ReactNode;
    /** Handler that is called when the popup's open state changes. */
    onOpenChange?: (open: boolean) => void;
}

export function RelativeDatePicker(props: RelativeDatePickerProps) {
    const state = useRelativeDatePickerState(props);

    const {
        groupProps,
        fieldProps,
        modeSwitcherProps,
        calendarButtonProps,
        popupProps,
        calendarProps,
        timeInputProps,
    } = useRelativeDatePickerProps(state, props);

    const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
    const handleRef = useForkRef(groupProps.ref, setAnchor);

    const isMobile = useMobile();
    const isOnlyTime =
        state.datePickerState.formatInfo.hasTime && !state.datePickerState.formatInfo.hasDate;

    return (
        <div {...groupProps} ref={handleRef} className={b(null, props.className)}>
            {isMobile && state.mode === 'absolute' && (
                <MobileCalendar
                    state={state.datePickerState}
                    props={{
                        id: props.id,
                        disabled: props.disabled,
                        readOnly: props.readOnly,
                        placeholderValue: props.placeholderValue,
                        timeZone: props.timeZone,
                    }}
                />
            )}
            <TextInput
                {...fieldProps}
                controlProps={{
                    ...fieldProps.controlProps,
                    disabled: isMobile && state.mode === 'absolute',
                    className: b('input', {mobile: isMobile && state.mode === 'absolute'}),
                }}
                hasClear={props.hasClear && !(isMobile && state.mode === 'absolute')}
                startContent={
                    <Button {...modeSwitcherProps}>
                        <Icon data={FunctionIcon} />
                    </Button>
                }
                endContent={
                    <React.Fragment>
                        {!isMobile && !isOnlyTime && (
                            <Button {...calendarButtonProps}>
                                <Icon data={CalendarIcon} />
                            </Button>
                        )}
                        {!isMobile && isOnlyTime && (
                            <StubButton size={calendarButtonProps.size} icon={ClockIcon} />
                        )}
                        {isMobile && state.mode === 'absolute' && (
                            <StubButton
                                size={calendarButtonProps.size}
                                icon={isOnlyTime ? ClockIcon : CalendarIcon}
                            />
                        )}
                    </React.Fragment>
                }
            />
            <HiddenInput
                name={props.name}
                value={state.value?.type}
                disabled={state.disabled}
                form={props.form}
            />
            <HiddenInput
                name={props.name}
                value={state.value}
                toStringValue={(value) => getNativeValue(value)}
                onReset={(value) => {
                    state.setValue(value);
                }}
                disabled={state.disabled}
                form={props.form}
            />
            {!isMobile && !isOnlyTime && (
                <Popup {...popupProps} anchorElement={anchor}>
                    <div className={b('popup-content')}>
                        {typeof props.children === 'function' ? (
                            props.children(calendarProps)
                        ) : (
                            <Calendar {...calendarProps} />
                        )}
                        {state.datePickerState.formatInfo.hasTime && (
                            <div className={b('time-field-wrapper')}>
                                <DateField {...timeInputProps} />
                            </div>
                        )}
                    </div>
                </Popup>
            )}
        </div>
    );
}

function getNativeValue(value: Value | null) {
    if (!value) {
        return '';
    }
    if (value.type === 'relative') {
        return value.value;
    }
    return value.value.toISOString();
}
