import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';
import svg from 'rollup-plugin-svg';
import json from '@rollup/plugin-json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';

const extensions = [...DEFAULT_EXTENSIONS, '.ts', '.tsx'];

export default [
    {
        preserveModules: true,
        input: './src/index.ts',
        output: {
            file: './dist/index.js',
            format: 'iife',
            extend: true,
            name: 'tgramChat',
            sourcemap: true,
        },
        plugins: [
            commonjs(), // CommonJS 모듈을 ES6 모듈로 변환
            peerDepsExternal(),
            nodeResolve({ extensions }),
            postcss({
                extract: false,
                modules: true,
                use: ['sass'],
            }),
            babel({
                babelHelpers: 'bundled',
                presets: [
                    '@babel/preset-env',
                    ['@babel/preset-react', { "runtime": "automatic" }],
                    '@babel/preset-typescript',
                ],
                plugins: ['@babel/plugin-transform-react-jsx'],
                extensions,
            }),
            typescript({ tsconfig: './tsconfig.json' }),
            svg(),
            json(),
            // terser(),
        ],
        // external: ["react", "react-dom"],
    },
    {
        input: './dist/types/index.d.ts',
        output: [
            {
                file: './dist/index.d.ts',
                format: 'es'
            },
        ],
        plugins: [dts()],
    },
];
