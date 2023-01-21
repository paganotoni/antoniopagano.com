module.exports = {
    content: [
      'layouts/**/*.html',  
      'layouts/*.html', 
      './content/**/*.md',
    ],
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
    ]
}