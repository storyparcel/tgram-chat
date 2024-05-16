import React from 'react';
import * as styles from './index.module.css';

type ButtonSize = 'l' | 'm';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    theme: 'blue' | 'gray' | 'blue-line' | 'white-line' | 'disabled';
    size?: ButtonSize;
}

const Button: React.FC<ButtonProps> = ({ theme, size = 'l', children, onClick, ...restProps }) => {
    let buttonClassName = styles.button;
    switch (theme) {
        case 'blue':
            buttonClassName += ` ${styles.blue}`;
            break;
        case 'gray':
            buttonClassName += ` ${styles.gray}`;
            break;
        case 'blue-line':
            buttonClassName += ` ${styles.blueLine}`;
            break;
        case 'white-line':
            buttonClassName += ` ${styles.whiteLine}`;
            break;
        case 'disabled':
            buttonClassName += ` ${styles.disabled}`;
            break;
        default:
            break;
    }

    return (
        <button
            className={`${buttonClassName} ${styles[size]}`}
            onClick={onClick}
            disabled={theme === 'disabled'}
            {...restProps}
        >
            {children}
        </button>
    );
};

export default Button;
