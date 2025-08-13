/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
   extend: {
         colors: {
           'dark-blue': '#10375c',
           'secondary-blue':'#176DBF',
           'Primary-Grey':'#F2F2F4',
           'Secondary-Font':'#7F7F8A',
           'Grey':'#6C7278',
           'Row-color':'#e5e7eb',
           'Table-Clr':'#f2f2f4',
             'blue-light': '#ebf8ff', // lighter than blue-50
        'indigo-light': '#e0e7ff', // lighter than indigo-50
         },
          screens: {
        md720: '720px', // custom breakpoint at 700px
      },
       },
  },
 plugins: [
    require('tailwindcss-scrollbar'), // Add scrollbar plugin
  ],
};
