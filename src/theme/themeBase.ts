import { white, gray, black, primary, red, green, purple, grayScale } from './palette';
import { typography } from './typography';

const colors = {
    gray,
    grayScale,
    white,
    black,
    red,
    green,
    purple,
    primary,
};

const base = {
    defaultWidth: 375,
};

const themeBase = {
    colors,
    typography,
    base,
};

export default themeBase;
