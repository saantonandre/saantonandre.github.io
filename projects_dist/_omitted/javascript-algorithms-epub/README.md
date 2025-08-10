## EPUB generator for JavaScript Algorithms and Data Structures

Generates an e-book(.epub) from [@trekhleb](https://github.com/trekhleb)'s [`javascript-algorithms`](https://github.com/trekhleb/javascript-algorithms) repository.

Running the  code does the following:
- Downloads the repo's content
- Filters out unnecessary files (no script files and such)
- Does some markdown manipulation to remove unnecessary content and fix various URLs
- Creates an epub chapter for each markdown file, converting its content to HTML
- Generates the .epub file from the chapters

### Instructions
- Run the command `yarn` to install the required dependencies
- Run the command `yarn start` to start the EPUB generation

**(Or if you're using npm, launch `npm install` and `npm start`)**

The .epub file will be generated under the `dist` directory.

### Involved libraries
Repository download:  
[git-clone](https://github.com/jaz303/git-clone)  

Markdown to HTML:  
[showdown](https://github.com/showdownjs/showdown)  

HTML to EPUB:  
[epub-gen](https://github.com/cyrilis/epub-gen)

### License
The script is available as open source under the terms of the [MIT License](https://opensource.org/license/mit/).
