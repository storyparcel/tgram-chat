declare const themeBase: {
    colors: {
        gray: import("./palette").IGray;
        grayScale: import("./palette").IGrayScale;
        white: import("./palette").IWhite;
        black: import("./palette").IBlack;
        red: import("./palette").IRed;
        green: import("./palette").IGreen;
        purple: import("./palette").IPurple;
        primary: import("./palette").IPrimary;
    };
    typography: {
        weight: {
            300: number;
            400: number;
            500: number;
            600: number;
            700: number;
            800: number;
        };
        size: {
            s1: number;
            m1: number;
            m2: number;
            l1: number;
            l2: number;
            '12': number;
            '14': number;
            '16': number;
            '18': number;
            '20': number;
        };
    };
    base: {
        defaultWidth: number;
    };
};
export default themeBase;
//# sourceMappingURL=themeBase.d.ts.map