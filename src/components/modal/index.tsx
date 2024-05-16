import React from 'react';
import Modal from 'react-modal';

const modalStyles: Modal.Styles = {
    overlay: {
        backgroundColor: '#00000060',
        zIndex: 1000000,
        // width: isMobile ? '100%' : theme.base.defaultWidth,
        margin: 'auto',
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: 'calc(-50% + 35px * 2)',
        border: 'none',
        borderRadius: 16,
        padding: 0,
        transform: 'translate(-50%, -50%)',
        // maxWidth: isMobile ? undefined : theme.base.defaultWidth - 35 * 2,
        minWidth: 270,
        boxSizing: 'border-box',
        textAlign: 'center',
    },
};

export interface IDefaultModal {
    open: boolean;
    onRequestClose?: () => void;
    children?: React.ReactNode;
};

Modal.setAppElement('#root');

const DefaultModal: React.FC<IDefaultModal> = (props) => {
    return (
        <Modal
            isOpen={props.open}
            shouldCloseOnEsc={false}
            shouldCloseOnOverlayClick={false}
            onRequestClose={props.onRequestClose}
            style={modalStyles}
        >
            <div>
                {props.children}
            </div>
        </Modal>
    );
};

export default DefaultModal;