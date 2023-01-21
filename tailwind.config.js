const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    content: [
      'layouts/**/*.html',  
      './content/**/*.md',
    ],
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
    ],
    theme: {
      extend: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    }
}