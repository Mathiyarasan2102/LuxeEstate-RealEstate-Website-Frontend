export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    900: '#0a192f',
                    950: '#051021', // Darker navy for main backgrounds/inputs
                    800: '#112240',
                    700: '#233554',
                    600: '#1e3a8a', // lighter navy for buttons
                },
                gold: {
                    400: '#d4af37',
                    500: '#c5a028',
                    600: '#b08d26',
                },
                cream: '#e6f1ff',
                slate: {
                    800: '#1e293b', // Darker standard slate
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            }
        },
    },
    plugins: [],
}
