# XSLT Transformer - XML/JDF Processor

A modern, web-based XSLT transformation tool that allows you to upload XML and JDF files and perform client-side transformations with syntax highlighting and intelligent file type detection.

![XSLT Transformer Interface](https://img.shields.io/badge/Interface-Bootstrap%205-blue) ![Browser Support](https://img.shields.io/badge/Browser-Modern%20Browsers-green) ![JDF Support](https://img.shields.io/badge/JDF-Supported-orange) ![License](https://img.shields.io/badge/License-MIT-brightgreen)

## ✨ Features

### Core Functionality
- **Client-Side Processing**: All transformations happen in your browser - no server required
- **Multiple Input Formats**: Support for XML and JDF (Job Definition Format) files
- **File Upload**: Drag & drop or click to upload XML/JDF and XSLT files
- **Real-Time Validation**: Instant validation of XML, JDF, and XSLT syntax
- **Intelligent Output**: Automatically detects XSLT output method (`xml`, `html`, `text`) for proper file extensions
- **Smart File Detection**: Preserves JDF format in output when appropriate
- **Download Results**: Save transformed files with appropriate extensions and MIME types

### User Interface
- **Modern Design**: Clean, responsive Bootstrap 5 interface
- **Dark/Light Mode**: Toggle between themes with persistent preference storage
- **Syntax Highlighting**: Beautiful XML/JDF syntax highlighting with color-coded elements
- **View Toggle**: Switch between highlighted and raw text views
- **Status Messages**: Clear feedback and error reporting with JDF-specific validation
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **JDF Information**: Built-in help modal explaining JDF format and use cases

### Advanced Features
- **XML/JDF Syntax Highlighting**: 
  - Color-coded tags, attributes, values, and comments
  - Support for namespaces and CDATA sections
  - Processing instruction highlighting
  - JDF-specific element recognition
- **Smart File Detection**: Automatically determines if output should be treated as XML, JDF, HTML, or text
- **JDF Validation**: Comprehensive validation for JDF-specific elements and structure
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
2. **Upload XML/JDF File**: Click "XML/JDF Document" and select your XML or JDF file
3. **Upload XSLT File**: Click "XSLT Stylesheet" and select your XSLT stylesheet
4. **Transform**: Click the "Transform Document" button
5. **View Results**: See the transformed output with syntax highlighting
6. **Download**: Save the result with the appropriate file extension (.xml, .jdf, .html, .csv, .txt)

## 📁 File Structure

```
xslt-transformer/
├── index.html          # Main HTML interface with JDF support
├── script.js           # Core application logic with JDF handling
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

### XML/JDF/XSLT Version Constraints
- **XML Version**: Supports XML 1.0 and XML 1.1
- **JDF Version**: Supports all JDF versions (JDF is XML-based)
- **XSLT Version**: Supports XSLT 1.0 (browser native implementation)
- **XSLT 2.0/3.0**: Not supported (requires browser's built-in XSLTProcessor which only supports XSLT 1.0)
- **Encoding**: UTF-8, UTF-16, and other standard encodings supported
- **Namespaces**: Full XML namespace support including JDF namespaces

### File Size Limits
- **XML/JDF Files**: Maximum 10MB
- **XSLT Files**: Maximum 5MB
- **Validation**: Real-time file size checking

### Supported File Types
- **XML**: `.xml` files (XML 1.0 and 1.1)
- **JDF**: `.jdf` files (Job Definition Format - XML-based)
- **XSLT**: `.xsl`, `.xslt` files (XSLT 1.0 only)
- **Output**: Automatically determined (`.xml`, `.jdf`, `.html`, `.csv`, `.txt`)

### JDF Support Details
- **Format Recognition**: Automatic detection of JDF files by extension and content analysis
- **JDF Validation**: Checks for JDF-specific elements like `<JDF>`, `Type` attributes, and ID attributes
- **Namespace Support**: Full support for JDF namespaces and CIP4 standards
- **Output Preservation**: Maintains JDF file extension when output is XML-like
- **MIME Type**: Uses appropriate MIME type (`application/vnd.cip4-jdf+xml`) for JDF files

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

<!-- XML Output (also suitable for JDF) -->
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

### Example 1: JDF to HTML Report Transformation

**JDF Input** (`print-job.jdf`):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<JDF xmlns="http://www.cip4.org/JDFSchema_1_1" Type="Product" ID="n_000001" JobID="J001">
    <NodeInfo>
        <Employee PersonalID="OP001">
            <Person DescriptiveName="John Operator"/>
        </Employee>
    </NodeInfo>
    <ResourcePool>
        <Component Class="Quantity" ID="r_000001" ComponentType="FinalProduct">
            <Component Class="Quantity" ID="r_000002" ComponentType="Sheet" Amount="1000"/>
        </Component>
        <Media Class="Consumable" ID="r_000003" 
               MediaType="Paper" Weight="80" Dimension="595.275 841.89"/>
    </ResourcePool>
    <CustomerInfo CustomerID="CUST001" CustomerJobID="ORDER2024001"/>
</JDF>
```

**XSLT Stylesheet** (`jdf-to-report.xsl`):
```xsl
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:jdf="http://www.cip4.org/JDFSchema_1_1">
    <xsl:output method="html" encoding="UTF-8"/>
    
    <xsl:template match="/">
        <html>
            <head><title>JDF Job Report</title></head>
            <body>
                <h1>Print Job Report</h1>
                <xsl:for-each select="//jdf:JDF">
                    <h2>Job ID: <xsl:value-of select="@JobID"/></h2>
                    <p><strong>Type:</strong> <xsl:value-of select="@Type"/></p>
                    <p><strong>Customer:</strong> <xsl:value-of select="jdf:CustomerInfo/@CustomerID"/></p>
                    
                    <h3>Resources</h3>
                    <ul>
                        <xsl:for-each select="jdf:ResourcePool/jdf:Media">
                            <li>
                                Media: <xsl:value-of select="@MediaType"/> 
                                (<xsl:value-of select="@Weight"/>g, 
                                <xsl:value-of select="@Dimension"/>)
                            </li>
                        </xsl:for-each>
                        <xsl:for-each select="jdf:ResourcePool/jdf:Component[@ComponentType='Sheet']">
                            <li>
                                Sheets: <xsl:value-of select="@Amount"/> units
                            </li>
                        </xsl:for-each>
                    </ul>
                </xsl:for-each>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
```

**Result**: Downloads as `print-job_transformed.html`

### Example 2: JDF to CSV Export

**XSLT for CSV export** (`jdf-to-csv.xsl`):
```xsl
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:jdf="http://www.cip4.org/JDFSchema_1_1">
    <xsl:output method="text" encoding="UTF-8"/>
    
    <xsl:template match="/">
        <xsl:text>JobID,Type,CustomerID,MediaType,Weight,Amount&#10;</xsl:text>
        <xsl:for-each select="//jdf:JDF">
            <xsl:value-of select="@JobID"/><xsl:text>,</xsl:text>
            <xsl:value-of select="@Type"/><xsl:text>,</xsl:text>
            <xsl:value-of select="jdf:CustomerInfo/@CustomerID"/><xsl:text>,</xsl:text>
            <xsl:value-of select="jdf:ResourcePool/jdf:Media/@MediaType"/><xsl:text>,</xsl:text>
            <xsl:value-of select="jdf:ResourcePool/jdf:Media/@Weight"/><xsl:text>,</xsl:text>
            <xsl:value-of select="jdf:ResourcePool/jdf:Component[@ComponentType='Sheet']/@Amount"/>
            <xsl:text>&#10;</xsl:text>
        </xsl:for-each>
    </xsl:template>
</xsl:stylesheet>
```

**Result**: Downloads as `print-job_transformed.csv`

### Example 3: JDF Simplification (JDF to simplified XML)

**XSLT for JDF simplification** (`jdf-simplify.xsl`):
```xsl
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:jdf="http://www.cip4.org/JDFSchema_1_1">
    <xsl:output method="xml" encoding="UTF-8" indent="yes"/>
    
    <xsl:template match="/">
        <PrintJobs>
            <xsl:for-each select="//jdf:JDF">
                <Job>
                    <ID><xsl:value-of select="@JobID"/></ID>
                    <Type><xsl:value-of select="@Type"/></Type>
                    <Customer><xsl:value-of select="jdf:CustomerInfo/@CustomerID"/></Customer>
                    <Materials>
                        <xsl:for-each select="jdf:ResourcePool/jdf:Media">
                            <Media type="{@MediaType}" weight="{@Weight}"/>
                        </xsl:for-each>
                    </Materials>
                    <Quantities>
                        <xsl:for-each select="jdf:ResourcePool/jdf:Component[@ComponentType='Sheet']">
                            <Sheets><xsl:value-of select="@Amount"/></Sheets>
                        </xsl:for-each>
                    </Quantities>
                </Job>
            </xsl:for-each>
        </PrintJobs>
    </xsl:template>
</xsl:stylesheet>
```

**Note**: This example shows JDF namespace handling in XSLT 1.0, which is fully supported.

**Result**: Downloads as `print-job_transformed.jdf` (maintains JDF extension for XML output from JDF input)

## 🐛 Troubleshooting

### Common Issues

#### "Browser does not support XSLT processing"
- **Solution**: Use a modern browser (Chrome, Firefox, Safari, Edge)
- **Note**: Internet Explorer is not supported

#### Files not uploading
- **Check file size**: XML/JDF files must be < 10MB, XSLT files < 5MB
- **Check file extension**: Only `.xml`, `.jdf`, `.xsl`, `.xslt` files are accepted
- **Verify file format**: Ensure files are valid XML/JDF/XSLT

#### JDF-specific issues
- **Invalid JDF structure**: Check for required `<JDF>` root element with `Type` and `ID` attributes
- **Namespace issues**: Ensure proper JDF namespace declaration (`xmlns="http://www.cip4.org/JDFSchema_1_1"`)
- **JDF validation warnings**: The app will warn about missing required JDF attributes but still process the file

#### XSLT transformation fails with "function not found" error
- **Cause**: Using XSLT 2.0 or 3.0 functions in your stylesheet
- **Solution**: Rewrite using XSLT 1.0 compatible functions
- **JDF Examples**: 
  - Use `substring()` instead of `regex` functions for JDF ID processing
  - Use `translate()` for case conversion instead of `upper-case()`/`lower-case()`
  - Avoid date/time formatting functions in JDF timestamp processing

#### XML/JDF parsing errors
- **Check XML version**: Ensure you're using XML 1.0 or 1.1
- **Validate encoding**: UTF-8 is recommended
- **Check well-formedness**: All tags must be properly closed and nested
- **JDF validation**: Ensure JDF elements follow CIP4 standards

#### Syntax highlighting not appearing
- **Check console**: Open developer tools to see detection logs
- **Verify content**: Ensure the output contains XML/JDF structure
- **Try toggle**: Use the Raw/Highlight button to manually switch views

### Debug Information

The application logs detailed information to the browser console:

```javascript
// Example console output for JDF files
Transformation result analysis: {
    contentLength: 2456,
    firstChars: "<?xml version='1.0'?><JDF...",
    isDetectedAsXML: true,
    isDetectedAsJDF: true,
    xsltOutputMethod: "xml",
    hasOpeningTags: 12,
    hasClosingTags: 12,
    jdfNamespaceFound: true
}
```

## 🔍 JDF (Job Definition Format) Information

### What is JDF?
JDF (Job Definition Format) is an XML-based technical standard used in the printing industry to:
- Define print job specifications
- Automate workflow processes
- Track job progress and status
- Manage resources and materials
- Ensure quality control

### Common JDF Elements
- **`<JDF>`**: Root element containing job definition
- **`<ResourcePool>`**: Container for job resources (media, components, etc.)
- **`<NodeInfo>`**: Information about processing nodes
- **`<AuditPool>`**: Audit trail and job history
- **`<CustomerInfo>`**: Customer and order information

### JDF Transformation Use Cases
- **Report Generation**: Convert JDF to HTML reports for management
- **Data Export**: Extract JDF data to CSV for analysis
- **Format Conversion**: Simplify complex JDF to basic XML
- **Integration**: Transform JDF for different systems
- **Archival**: Convert JDF to readable formats for long-term storage

## 🤝 Contributing

### Development Setup

1. **Clone the repository**
2. **Open in your preferred editor**
3. **Use a local web server** for testing
4. **Test with both XML and JDF files**

### Code Style

- **JavaScript**: ES6+ features, clear variable names
- **CSS**: CSS custom properties for theming
- **HTML**: Semantic markup, accessibility considerations

### Adding Features

1. **Fork the repository**
2. **Create a feature branch**
3. **Test thoroughly with various JDF files**
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
- **Test with simple XML/JDF and XSLT files** first
- **Use the JDF info modal** in the application for format guidance

### Browser Console Debugging

Enable debugging by opening Developer Tools (F12) and checking the Console tab for detailed transformation analysis and JDF validation messages.

### JDF Resources

- **CIP4 Organization**: [www.cip4.org](https://www.cip4.org) - Official JDF standards
- **JDF Specification**: Technical documentation for JDF format
- **Sample JDF Files**: Use the application's help modal for example JDF structures

---

**Made with ❤️ for the XML/JDF and printing industry community**

*Transform your XML and JDF data with style and ease!*