const path = require('path');

module.exports = () => {
    return {
        mode: 'none',
        entry: path.resolve(__dirname, 'src', 'index.ts'),
        output: {
            path: path.resolve(__dirname, 'dist'),
            libraryTarget: 'amd',
            filename: 'index.js',
        },
        devtool: 'none',
        resolve: {
            extensions: ['.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    include: path.resolve(__dirname, 'src'),
                },
                {
                    test: /\.js$/,
                    use: [
                        {
                            loader: 'babel-loader',
                        },
                    ],
                    include: [
                        require.resolve('adaptive-expressions'),
                        require.resolve('@microsoft/recognizers-text-data-types-timex-expression'),
                        require.resolve('antlr4ts'),
                        require.resolve('lru-cache'),
                        require.resolve('yallist'),
                    ],
                },
            ],
        },
    };
};
