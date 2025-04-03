import { defineConfig } from 'vite';

export default defineConfig({
    root: 'src',
    base: '', 
    build: {
        outDir: '../dist',
        rollupOptions: {
            input: {
                main: 'src/index.html',
            }
        }
    },
    server: {
        historyApiFallback: true
    }
});
