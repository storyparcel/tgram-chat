import React, { useCallback, useState } from 'react';
import DefaultModal from '../components/modal/index';

export interface IOptions {
    onRequestClose?: () => void;
    cancelButton?: {
        onClick: () => void;
        text: string;
        style?: React.CSSProperties;
    };
    confirmButton?: {
        onClick: () => void;
        text: string;
        style?: React.CSSProperties;
    };
};

const useModal = (options?: IOptions) => {
    const [ isOpen, setIsOpen ] = useState<boolean>(false);

    const openModal = useCallback(() => {
        if (!isOpen) {
            setIsOpen(true);
        }
    }, []);

    const closeModal = useCallback(() => {
        if (isOpen) {
            setIsOpen(false);
        }
    }, [ isOpen ]);

    return {
        Modal: isOpen
            ? ({ children }: { children: React.ReactNode }) => (
                <DefaultModal
                    {...options}
                    onRequestClose={() => {
                        closeModal();
                        options?.onRequestClose && options.onRequestClose();
                    }}
                    open={isOpen}
                >
                    {children}
                </DefaultModal>
            )
            : () => null,
        openModal,
        closeModal,
        isOpen,
    };
};

export default useModal;