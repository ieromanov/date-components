'use client';

import {Popup, Sheet} from '@gravity-ui/uikit';
import type {PopupProps} from '@gravity-ui/uikit';

import {block} from '../../../../utils/cn';
import type {PopupStyleProps} from '../../../types';

import {PickerForm} from './PickerForm';
import type {PickerFormProps} from './PickerForm';

import './PickerDialog.scss';

const b = block('relative-range-date-picker-dialog');

export interface PickerDialogProps extends PickerFormProps, PopupStyleProps {
    /** Popup anchor */
    anchor: HTMLElement | null;
    /** Manages `Popup` visibility */
    open: boolean;
    /** Handles popup close event */
    onClose: (reason?: Parameters<NonNullable<PopupProps['onOpenChange']>>[2] | 'apply') => void;
    /** Handles popup remove from DOM event */
    onRemove?: () => void;
    /** If true `Popup` act like a modal dialog */
    modal?: boolean;
    /** Element which focus should be returned to */
    returnFocus?: PopupProps['returnFocus'];
    /** If true `Sheet` is used instead of `Popup`  */
    isMobile?: boolean;
}

export function PickerDialog({
    open,
    onClose,
    isMobile,
    anchor,
    popupClassName,
    popupStyle,
    popupPlacement,
    popupOffset,
    modal,
    returnFocus = false,
    onRemove,
    ...props
}: PickerDialogProps) {
    if (isMobile) {
        return (
            <Sheet
                visible={open}
                onClose={() => {
                    onClose('outside-press');
                    setTimeout(() => {
                        onRemove?.();
                    });
                }}
                contentClassName={b('content', {mobile: true, size: 'xl'}, popupClassName)}
            >
                <PickerForm
                    {...props}
                    size="xl"
                    onApply={() => {
                        onClose('apply');
                    }}
                />
            </Sheet>
        );
    }

    return (
        <Popup
            open={open}
            onOpenChange={(isOpen, _event, reason) => {
                if (!isOpen) {
                    onClose(reason);
                }
            }}
            placement={popupPlacement}
            offset={popupOffset}
            role="dialog"
            anchorElement={anchor}
            className={b('content', {size: props.size}, popupClassName)}
            style={popupStyle}
            modal={modal}
            returnFocus={returnFocus}
            onTransitionOutComplete={onRemove}
        >
            <PickerForm
                {...props}
                onApply={() => {
                    onClose('apply');
                }}
            />
        </Popup>
    );
}
