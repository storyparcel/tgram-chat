export interface IGray {
    1: string;
    2: string;
    3: string;
};

export interface IGrayScale {
    5: string;
    10: string;
    15: string;
    20: string;
    40: string;
    50: string;
    60: string;
    70: string;
    80: string;
};

export interface IWhite {
    base: string;
};

export interface IBlack {
    base: string;
};

export interface IRed {
    light: string;
    base: string;
};

export interface IGreen {
    light: string;
    base: string;
};

export interface IPurple {
    light: string;
    base: string;
};

export interface IPrimary {
    light: string;
    base: string;
};

export const gray: IGray = {
    1: '#616161',
    2: '#A3A3A3',
    3: '#EBEBEB',
};

export const grayScale: IGrayScale = {
    5: '#F8F9FA',
    10: '#F0F2F4',
    15: '#E8EAEE',
    20: '#DCDEE4',
    40: '#BCBEC6',
    50: '#9EA2A8',
    60: '#7B7D84',
    70: '#585C64',
    80: '#30343C',
};

export const white: IWhite = {
    base: '#ffffff',
};

export const black: IBlack = {
    base: '#030303',
};

export const red: IRed = {
    light: '#FFE9ED',
    base: '#FF3D67',
};

export const green: IGreen = {
    light: '#D7F0E2',
    base: '#45CC7E',
};

export const purple: IPurple = {
    light: '#EEE5FF',
    base: '#742FDD',
};

export const primary: IPrimary = {
    light: '#E4EEFF',
    base: '#3B88FF',
};