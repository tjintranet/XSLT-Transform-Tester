# XSLT Transformer

A modern, web-based XSLT transformation tool that allows you to upload XML and XSLT files and perform client-side transformations with syntax highlighting and intelligent file type detection.

![XSLT Transformer Interface](https://img.shields.io/badge/Interface-Bootstrap%205-blue) ![Browser Support](https://img.shields.io/badge/Browser-Modern%20Browsers-green) ![License](https://img.shields.io/badge/License-MIT-brightgreen)

## ✨ Features

### Core Functionality
- **Client-Side Processing**: All transformations happen in your browser - no server required
- **File Upload**: Drag & drop or click to upload XML and XSLT files
- **Real-Time Validation**: Instant validation of XML and XSLT syntax
- **Intelligent Output**: Automatically detects XSLT output method (`xml`, `html`, `text`) for proper file extensions
- **Download Results**: Save transformed files with appropriate extensions and MIME types

### User Interface
- **Modern Design**: Clean, responsive Bootstrap 5 interface
- **Dark/Light Mode**: Toggle between themes with persistent preference storage
- **Syntax Highlighting**: Beautiful XML syntax highlighting with color-coded elements
- **View Toggle**: Switch between highlighted and raw text views
- **Status Messages**: Clear feedback and error reporting
- **Responsive Layout**: Works on desktop, tablet, and mobile devices

### Advanced Features
- **XML Syntax Highlighting**: 
  - Color-coded tags, attributes, values, and comments
  - Support for namespaces and CDATA sections
  - Processing instruction highlighting
- **Smart File Detection**: Automatically determines if output should be treated as XML, HTML, or text
- **Error Handling**: Comprehensive error messages for invalid files or transformation issues
- **Browser Compatibility**: Checks for XSLT processor support

## 🚀 Quick Start

### Installation

1. **Clone or Download**: Get the project files
2. **No Build Process**: This is a pure client-side application
3. **Serve Files**: Use any web server or open `index.html` directly

```bash
# Using Python's built-in server
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Or simply open index.html in your browser
```

### Basic Usage

1. **Open the Application**: Navigate to `index.html` in your browser
2. **Upload XML File**: Click "XML Document" and select your XML file
3. **Upload XSLT File**: Click "XSLT Document" and select your XSLT stylesheet
4. **Transform**: Click the "Transform XML" button
5. **View Results**: See the transformed output with syntax highlighting
6. **Download**: Save the result with the appropriate file extension

## 📁 File Structure

```
xslt-transformer/
├── index.html          # Main HTML interface
├── script.js           # Core application logic
├── style.css           # Styling and themes
├── favicon-32x32.png   # Favicon (32x32)
├── apple-touch-icon.png # Apple touch icon
└── README.md           # This file
```

## 🛠️ Technical Details

### Dependencies
- **Bootstrap 5.3.0**: UI framework and components
- **Bootstrap Icons 1.10.0**: Icon set
- **Native Browser APIs**: XSLTProcessor, DOMParser, FileReader

### Browser Requirements
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **XSLT Support**: Requires native `XSLTProcessor` support
- **File API Support**: For reading uploaded files
- **ES6+ Support**: Modern JavaScript features

### XML/XSLT Version Constraints
- **XML Version**: Supports XML 1.0 and XML 1.1
- **XSLT Version**: Supports XSLT 1.0 (browser native implementation)
- **XSLT 2.0/3.0**: Not supported (requires browser's built-in XSLTProcessor which only supports XSLT 1.0)
- **Encoding**: UTF-8, UTF-16, and other standard encodings supported
- **Namespaces**: Full XML namespace support

### File Size Limits
- **XML Files**: Maximum 10MB
- **XSLT Files**: Maximum 5MB
- **Validation**: Real-time file size checking

### Supported File Types
- **XML**: `.xml` files (XML 1.0 and 1.1)
- **XSLT**: `.xsl`, `.xslt` files (XSLT 1.0 only)
- **Output**: Automatically determined (`.xml`, `.html`, `.txt`)

### Important Limitations
- **XSLT Version**: Only XSLT 1.0 is supported due to browser limitations
- **Advanced Functions**: XSLT 2.0/3.0 functions (like `format-date`, `regex`, etc.) will not work
- **Processing**: All processing happens client-side using the browser's native XSLT processor

## 🎨 Themes and Customization

### Dark/Light Mode
- **Toggle Button**: Top-right corner of the interface
- **Persistent Storage**: Theme preference saved in localStorage
- **Smooth Transitions**: Animated theme switching

### Syntax Highlighting Colors

#### Light Theme
- **Tags**: Blue (`#0066cc`)
- **Attributes**: Orange (`#cc6600`)
- **Values**: Green (`#009900`)
- **Comments**: Gray (`#808080`)
- **XML Declarations**: Pink (`#cc0066`)

#### Dark Theme
- **Tags**: Light Blue (`#4fc3f7`)
- **Attributes**: Orange (`#ffb74d`)
- **Values**: Light Green (`#81c784`)
- **Comments**: Gray (`#9e9e9e`)
- **XML Declarations**: Pink (`#f06292`)

## 🔧 Configuration

### XSLT Output Method Detection

The application automatically detects the XSLT output method:

```xsl
<!-- HTML Output -->
<xsl:output method="html" encoding="UTF-8"/>

<!-- XML Output -->
<xsl:output method="xml" encoding="UTF-8" indent="yes"/>

<!-- Text Output -->
<xsl:output method="text" encoding="UTF-8"/>
```

### Custom CSS Variables

You can customize the appearance by modifying CSS variables:

```css
:root {
    --xml-tag-color: #0066cc;
    --xml-attribute-color: #cc6600;
    --xml-value-color: #009900;
    /* ... more variables */
}
```

## 📖 Usage Examples

### Example 1: Basic XML to HTML Transformation

**XML Input** (`books.xml`):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<library>
    <book id="1">
        <title>The Great Gatsby</title>
        <author>F. Scott Fitzgerald</author>
        <year>1925</year>
    </book>
    <book id="2">
        <title>To Kill a Mockingbird</title>
        <author>Harper Lee</author>
        <year>1960</year>
    </book>
</library>
```

**XSLT Stylesheet** (`books.xsl`):
```xsl
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8"/>
    
    <xsl:template match="/">
        <html>
            <head><title>Library Books</title></head>
            <body>
                <h1>Library Collection</h1>
                <ul>
                    <xsl:for-each select="library/book">
                        <li>
                            <strong><xsl:value-of select="title"/></strong>
                            by <xsl:value-of select="author"/>
                            (<xsl:value-of select="year"/>)
                        </li>
                    </xsl:for-each>
                </ul>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
```

**Note**: This uses XSLT 1.0 syntax which is fully supported.

**Result**: Downloads as `books_transformed.html`

### Example 2: XML to XML Transformation with Syntax Highlighting

**XSLT for filtering** (`filter-recent.xsl`):
```xsl
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" encoding="UTF-8" indent="yes"/>
    
    <xsl:template match="/">
        <recent-books>
            <xsl:for-each select="library/book[year &gt; 1950]">
                <book>
                    <title><xsl:value-of select="title"/></title>
                    <author><xsl:value-of select="author"/></author>
                    <year><xsl:value-of select="year"/></year>
                </book>
            </xsl:for-each>
        </recent-books>
    </xsl:template>
</xsl:stylesheet>
```

### Example 3: XSLT 1.0 Compatible Functions

**XSLT for text processing** (`text-processing.xsl`):
```xsl
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" encoding="UTF-8" indent="yes"/>
    
    <xsl:template match="/">
        <processed-books>
            <xsl:for-each select="library/book">
                <book>
                    <!-- Use translate() for case conversion (XSLT 1.0 compatible) -->
                    <title-upper>
                        <xsl:value-of select="translate(title, 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')"/>
                    </title-upper>
                    <!-- Use substring() and string-length() (XSLT 1.0 compatible) -->
                    <title-short>
                        <xsl:value-of select="substring(title, 1, 10)"/>
                        <xsl:if test="string-length(title) &gt; 10">...</xsl:if>
                    </title-short>
                    <author><xsl:value-of select="author"/></author>
                </book>
            </xsl:for-each>
        </processed-books>
    </xsl:template>
</xsl:stylesheet>
```

**Note**: This example shows XSLT 1.0 compatible text processing functions.

## 🐛 Troubleshooting

### Common Issues

#### "Browser does not support XSLT processing"
- **Solution**: Use a modern browser (Chrome, Firefox, Safari, Edge)
- **Note**: Internet Explorer is not supported

#### Files not uploading
- **Check file size**: XML files must be < 10MB, XSLT files < 5MB
- **Check file extension**: Only `.xml`, `.xsl`, `.xslt` files are accepted
- **Verify file format**: Ensure files are valid XML/XSLT

#### XSLT transformation fails with "function not found" error
- **Cause**: Using XSLT 2.0 or 3.0 functions in your stylesheet
- **Solution**: Rewrite using XSLT 1.0 compatible functions
- **Examples**: 
  - Use `substring()` instead of `regex` functions
  - Use `translate()` for case conversion instead of `upper-case()`/`lower-case()`
  - Avoid date/time formatting functions

#### XML parsing errors
- **Check XML version**: Ensure you're using XML 1.0 or 1.1
- **Validate encoding**: UTF-8 is recommended
- **Check well-formedness**: All tags must be properly closed and nested

#### Syntax highlighting not appearing
- **Check console**: Open developer tools to see detection logs
- **Verify content**: Ensure the output contains XML structure
- **Try toggle**: Use the Raw/Highlight button to manually switch views

### Debug Information

The application logs detailed information to the browser console:

```javascript
// Example console output
Transformation result analysis: {
    contentLength: 1234,
    firstChars: "<?xml version='1.0'?>...",
    isDetectedAsXML: true,
    xsltOutputMethod: "xml",
    hasOpeningTags: 5,
    hasClosingTags: 5
}
```

## 🤝 Contributing

### Development Setup

1. **Clone the repository**
2. **Open in your preferred editor**
3. **Use a local web server** for testing
4. **Test in multiple browsers**

### Code Style

- **JavaScript**: ES6+ features, clear variable names
- **CSS**: CSS custom properties for theming
- **HTML**: Semantic markup, accessibility considerations

### Adding Features

1. **Fork the repository**
2. **Create a feature branch**
3. **Test thoroughly**
4. **Submit a pull request**

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙋‍♂️ Support

### Getting Help

- **Check the troubleshooting section** above
- **Open browser developer tools** for error messages
- **Verify browser compatibility**
- **Test with simple XML/XSLT files** first

### Browser Console Debugging

Enable debugging by opening Developer Tools (F12) and checking the Console tab for detailed transformation analysis.

---

**Made with ❤️ for the XML/XSLT community**

*Transform your data with style and ease!*