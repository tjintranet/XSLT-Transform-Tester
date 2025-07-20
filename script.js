// @ts-nocheck
/* eslint-disable */

// XSLT Transformer Application
class XSLTTransformer {
    constructor() {
        this.xmlFile = null;
        this.xsltFile = null;
        this.xmlContent = null;
        this.xsltContent = null;
        this.transformedResult = null;
        this.xsltOutputMethod = null; // Store the detected output method
        
        this.initializeElements();
        this.attachEventListeners();
        this.initializeDarkMode();
    }
    
    initializeElements() {
        this.xmlFileInput = document.getElementById('xmlFile');
        this.xsltFileInput = document.getElementById('xsltFile');
        this.transformBtn = document.getElementById('transformBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.statusMessages = document.getElementById('statusMessages');
        this.resultContainer = document.getElementById('resultContainer');
        this.resultTextarea = document.getElementById('resultTextarea');
        this.loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
        this.darkModeToggle = document.getElementById('darkModeToggle');
        this.darkModeIcon = document.getElementById('darkModeIcon');
    }
    
    attachEventListeners() {
        this.xmlFileInput.addEventListener('change', (e) => this.handleXMLFileSelect(e));
        this.xsltFileInput.addEventListener('change', (e) => this.handleXSLTFileSelect(e));
        this.transformBtn.addEventListener('click', () => this.performTransformation());
        this.downloadBtn.addEventListener('click', () => this.downloadResult());
        this.clearAllBtn.addEventListener('click', () => this.clearAll());
        this.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
    }
    
    async handleXMLFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            try {
                if (!this.isValidXMLFile(file)) {
                    throw new Error('Please select a valid XML or JDF file (.xml or .jdf extension)');
                }
                
                if (file.size > 10 * 1024 * 1024) {
                    throw new Error('File size must be less than 10MB');
                }
                
                this.xmlFile = file;
                this.xmlContent = await this.readFileContent(file);
                
                // Check if it's a JDF file and validate accordingly
                const isJDFFile = this.isJDFFile(file, this.xmlContent);
                if (isJDFFile) {
                    await this.validateJDFContent(this.xmlContent);
                    this.showStatus(`JDF file "${file.name}" loaded and validated successfully`, 'success');
                } else {
                    await this.validateXMLContent(this.xmlContent);
                    this.showStatus(`XML file "${file.name}" loaded and validated successfully`, 'success');
                }
                
                this.validateInput(this.xmlFileInput, true);
                this.checkReadyState();
            } catch (error) {
                this.xmlFile = null;
                this.xmlContent = null;
                this.validateInput(this.xmlFileInput, false);
                this.showStatus(`Error with file: ${error.message}`, 'danger');
            }
        }
    }
    
    async handleXSLTFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            try {
                if (!this.isValidXSLTFile(file)) {
                    throw new Error('Please select a valid XSLT file (.xsl or .xslt extension)');
                }
                
                if (file.size > 5 * 1024 * 1024) {
                    throw new Error('File size must be less than 5MB');
                }
                
                this.xsltFile = file;
                this.xsltContent = await this.readFileContent(file);
                
                await this.validateXSLTContent(this.xsltContent);
                
                // Detect output method from XSLT
                this.xsltOutputMethod = this.detectXSLTOutputMethod(this.xsltContent);
                
                this.validateInput(this.xsltFileInput, true);
                this.showStatus(`XSLT file "${file.name}" loaded and validated successfully`, 'success');
                this.checkReadyState();
            } catch (error) {
                this.xsltFile = null;
                this.xsltContent = null;
                this.xsltOutputMethod = null;
                this.validateInput(this.xsltFileInput, false);
                this.showStatus(`Error with XSLT file: ${error.message}`, 'danger');
            }
        }
    }
    
    /**
     * Check if the file is a JDF file based on extension and content
     * @param {File} file - The uploaded file
     * @param {string} content - The file content
     * @returns {boolean} - Whether this is a JDF file
     */
    isJDFFile(file, content) {
        const fileName = file.name.toLowerCase();
        const hasJDFExtension = fileName.endsWith('.jdf');
        
        // Check content for JDF-specific elements or namespaces
        const hasJDFElements = content.includes('<JDF') || 
                              content.includes('xmlns:jdf') ||
                              content.includes('www.cip4.org') ||
                              content.includes('JDF-') ||
                              content.includes('<Job ') ||
                              content.includes('JobPartID');
        
        return hasJDFExtension || hasJDFElements;
    }
    
    /**
     * Validate JDF content - JDF is XML with specific schema requirements
     * @param {string} content - The JDF content to validate
     */
    async validateJDFContent(content) {
        return new Promise((resolve, reject) => {
            try {
                // First validate as XML
                const parser = new DOMParser();
                const jdfDoc = parser.parseFromString(content, 'text/xml');
                
                const parseError = jdfDoc.querySelector('parsererror');
                if (parseError) {
                    reject(new Error(`Invalid JDF (XML parsing failed): ${parseError.textContent}`));
                    return;
                }
                
                if (!jdfDoc.documentElement) {
                    reject(new Error('JDF document must have a root element'));
                    return;
                }
                
                const root = jdfDoc.documentElement;
                
                // Check for JDF-specific validation
                if (root.localName === 'JDF' || content.includes('<JDF')) {
                    // Basic JDF validation - check for required attributes
                    const jdfElements = jdfDoc.querySelectorAll('JDF');
                    if (jdfElements.length > 0) {
                        const mainJDF = jdfElements[0];
                        
                        // JDF should have Type attribute
                        if (!mainJDF.hasAttribute('Type') && !mainJDF.hasAttribute('type')) {
                            console.warn('JDF element missing Type attribute - this may not be fully compliant');
                        }
                        
                        // JDF should have ID attribute
                        if (!mainJDF.hasAttribute('ID') && !mainJDF.hasAttribute('id')) {
                            console.warn('JDF element missing ID attribute - this may not be fully compliant');
                        }
                    }
                    
                    console.log('JDF file validation passed - detected JDF-specific elements');
                } else {
                    console.log('File appears to be XML rather than JDF format, but will proceed');
                }
                
                resolve();
            } catch (error) {
                reject(new Error(`JDF validation failed: ${error.message}`));
            }
        });
    }
    
    /**
     * Detect the output method specified in the XSLT stylesheet
     * @param {string} xsltContent - The XSLT content
     * @returns {string} - The detected output method (xml, html, text, csv, or null)
     */
    detectXSLTOutputMethod(xsltContent) {
        try {
            const parser = new DOMParser();
            const xsltDoc = parser.parseFromString(xsltContent, 'text/xml');
            
            // Look for xsl:output element
            const outputElements = xsltDoc.querySelectorAll('output');
            for (let output of outputElements) {
                if (output.namespaceURI === 'http://www.w3.org/1999/XSL/Transform') {
                    const method = output.getAttribute('method');
                    if (method) {
                        return method.toLowerCase();
                    }
                }
            }
            
            // If no explicit output method, try to detect from content
            const rootElement = xsltDoc.documentElement;
            const templates = rootElement.querySelectorAll('template');
            
            for (let template of templates) {
                if (template.namespaceURI === 'http://www.w3.org/1999/XSL/Transform') {
                    const templateContent = template.textContent || '';
                    
                    // Look for CSV indicators (comma patterns, headers)
                    if (templateContent.includes(',') && 
                        (templateContent.includes('&#10;') || templateContent.includes('\n')) &&
                        templateContent.match(/[A-Za-z]+,[A-Za-z]+/)) {
                        return 'csv';
                    }
                    
                    // Look for HTML indicators
                    if (templateContent.includes('<html') || 
                        templateContent.includes('<!DOCTYPE html') ||
                        templateContent.includes('<head>') ||
                        templateContent.includes('<body>')) {
                        return 'html';
                    }
                    
                    // Look for XML indicators (less reliable, but better than nothing)
                    if (templateContent.includes('<?xml') || 
                        template.innerHTML.includes('<') && 
                        !templateContent.includes('<html')) {
                        return 'xml';
                    }
                }
            }
            
            // Default fallback
            return null;
        } catch (error) {
            console.warn('Could not detect XSLT output method:', error);
            return null;
        }
    }
    
    readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }
    
    isValidXMLFile(file) {
        const validExtensions = ['.xml', '.jdf'];
        const fileName = file.name.toLowerCase();
        return validExtensions.some(ext => fileName.endsWith(ext));
    }
    
    isValidXSLTFile(file) {
        const validExtensions = ['.xsl', '.xslt'];
        const fileName = file.name.toLowerCase();
        return validExtensions.some(ext => fileName.endsWith(ext));
    }
    
    async validateXMLContent(content) {
        return new Promise((resolve, reject) => {
            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(content, 'text/xml');
                
                const parseError = xmlDoc.querySelector('parsererror');
                if (parseError) {
                    reject(new Error(`Invalid XML: ${parseError.textContent}`));
                    return;
                }
                
                if (!xmlDoc.documentElement) {
                    reject(new Error('XML document must have a root element'));
                    return;
                }
                
                resolve();
            } catch (error) {
                reject(new Error(`XML validation failed: ${error.message}`));
            }
        });
    }
    
    async validateXSLTContent(content) {
        return new Promise((resolve, reject) => {
            try {
                const parser = new DOMParser();
                const xsltDoc = parser.parseFromString(content, 'text/xml');
                
                const parseError = xsltDoc.querySelector('parsererror');
                if (parseError) {
                    reject(new Error(`Invalid XSLT: ${parseError.textContent}`));
                    return;
                }
                
                const root = xsltDoc.documentElement;
                if (!root) {
                    reject(new Error('XSLT document must have a root element'));
                    return;
                }
                
                const isXSLT = root.namespaceURI === 'http://www.w3.org/1999/XSL/Transform' &&
                              (root.localName === 'stylesheet' || root.localName === 'transform');
                
                if (!isXSLT) {
                    reject(new Error('File does not appear to be a valid XSLT stylesheet'));
                    return;
                }
                
                resolve();
            } catch (error) {
                reject(new Error(`XSLT validation failed: ${error.message}`));
            }
        });
    }
    
    validateInput(inputElement, isValid) {
        inputElement.classList.remove('is-valid', 'is-invalid');
        inputElement.classList.add(isValid ? 'is-valid' : 'is-invalid');
    }
    
    checkReadyState() {
        const isReady = this.xmlContent && this.xsltContent;
        this.transformBtn.disabled = !isReady;
        
        if (isReady) {
            this.transformBtn.innerHTML = '<i class="bi bi-arrow-repeat me-2"></i>Transform XML/JDF';
            this.showStatus('Ready to transform! Click the Transform button.', 'info');
        }
    }
    
    async performTransformation() {
        if (!this.xmlContent || !this.xsltContent) {
            this.showStatus('Please select both XML/JDF and XSLT files', 'danger');
            return;
        }
        
        this.showLoadingModal(true);
        
        // Update status message based on file type
        const isJDF = this.isJDFFile(this.xmlFile, this.xmlContent);
        this.showStatus(`Transforming ${isJDF ? 'JDF' : 'XML'}...`, 'info');
        
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const result = await this.transformXML(this.xmlContent, this.xsltContent);
            this.transformedResult = result;
            
            this.displayResult(result);
            this.downloadBtn.disabled = false;
            this.showStatus('Transformation completed successfully!', 'success');
            
        } catch (error) {
            this.showStatus(`Transformation failed: ${error.message}`, 'danger');
            console.error('Transformation error:', error);
        } finally {
            this.showLoadingModal(false);
        }
    }
    
    async transformXML(xmlString, xsltString) {
        return new Promise((resolve, reject) => {
            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
                
                const xmlParseError = xmlDoc.querySelector('parsererror');
                if (xmlParseError) {
                    throw new Error(`XML/JDF parsing error: ${xmlParseError.textContent}`);
                }
                
                const xsltDoc = parser.parseFromString(xsltString, 'text/xml');
                
                const xsltParseError = xsltDoc.querySelector('parsererror');
                if (xsltParseError) {
                    throw new Error(`XSLT parsing error: ${xsltParseError.textContent}`);
                }
                
                const xsltProcessor = new XSLTProcessor();
                xsltProcessor.importStylesheet(xsltDoc);
                
                const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
                
                const serializer = new XMLSerializer();
                let resultString = serializer.serializeToString(resultDoc);
                
                // Post-process the result to extract pure text when needed
                resultString = this.postProcessTransformResult(resultString);
                
                const formattedResult = this.formatOutput(resultString);
                resolve(formattedResult);
                
            } catch (error) {
                reject(error);
            }
        });
    }
    
    /**
     * Post-process transformation result to handle browser XSLT quirks
     * @param {string} result - The raw transformation result
     * @returns {string} - The processed result
     */
    postProcessTransformResult(result) {
        // Check if the result is HTML-wrapped text content (common with method="text")
        if (result.includes('<!DOCTYPE html') && 
            this.xsltOutputMethod === 'text' && 
            result.includes('<pre>')) {
            
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(result, 'text/html');
                const preElement = doc.querySelector('pre');
                
                if (preElement) {
                    // Extract the text content from the <pre> element
                    let textContent = preElement.textContent || preElement.innerText || '';
                    
                    // Clean up any extra whitespace while preserving line breaks
                    textContent = textContent.replace(/^\s+|\s+$/g, ''); // Trim start/end
                    
                    console.log('Extracted pure text from HTML wrapper');
                    return textContent;
                }
            } catch (error) {
                console.warn('Failed to extract text from HTML wrapper:', error);
            }
        }
        
        // Check for other HTML wrappers that might contain CSV/text data
        if (result.includes('<html') && 
            (this.xsltOutputMethod === 'text' || this.xsltOutputMethod === 'csv')) {
            
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(result, 'text/html');
                
                // Try to find the actual content in various containers
                const containers = ['pre', 'body', 'div'];
                
                for (const tagName of containers) {
                    const element = doc.querySelector(tagName);
                    if (element && element.textContent && element.textContent.includes(',')) {
                        let textContent = element.textContent.trim();
                        console.log(`Extracted text content from ${tagName} element`);
                        return textContent;
                    }
                }
            } catch (error) {
                console.warn('Failed to extract content from HTML:', error);
            }
        }
        
        return result;
    }
    
    /**
     * Format the output based on detected type
     * @param {string} content - The content to format
     * @returns {string} - The formatted content
     */
    formatOutput(content) {
        // For CSV/text content, don't apply XML formatting
        if (this.detectCSVContent(content) || this.xsltOutputMethod === 'text' || this.xsltOutputMethod === 'csv') {
            return content;
        }
        
        // For XML content, apply formatting
        return this.formatXML(content);
    }
    
    formatXML(xmlString) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
            
            const parseError = xmlDoc.querySelector('parsererror');
            if (parseError) {
                return xmlString;
            }
            
            return this.prettyPrintXML(xmlDoc);
        } catch (error) {
            return xmlString;
        }
    }
    
    prettyPrintXML(xmlDoc) {
        const serializer = new XMLSerializer();
        let xmlString = serializer.serializeToString(xmlDoc);
        
        xmlString = xmlString.replace(/>\s*</g, '><');
        
        let formatted = '';
        let indent = 0;
        const tab = '  ';
        
        xmlString.split('<').forEach((node, index) => {
            if (index === 0) {
                if (node.trim()) {
                    formatted += node.trim();
                }
                return;
            }
            
            if (node.includes('>')) {
                const parts = node.split('>');
                const tag = parts[0];
                const content = parts.slice(1).join('>');
                
                const isClosingTag = tag.startsWith('/');
                const isSelfClosing = tag.endsWith('/') || this.isSelfClosingTag(tag);
                const isXMLDeclaration = tag.startsWith('?xml');
                const isComment = tag.startsWith('!--');
                const isProcessingInstruction = tag.startsWith('?');
                
                if (isClosingTag) {
                    indent = Math.max(0, indent - 1);
                }
                
                if (!isXMLDeclaration) {
                    formatted += '\n' + tab.repeat(indent);
                }
                
                formatted += '<' + tag + '>';
                
                if (!isClosingTag && !isSelfClosing && !isXMLDeclaration && !isComment && !isProcessingInstruction) {
                    indent++;
                }
                
                if (content) {
                    const trimmedContent = content.trim();
                    if (trimmedContent) {
                        if (!trimmedContent.includes('<')) {
                            formatted += trimmedContent;
                        } else {
                            formatted += content;
                        }
                    }
                }
            }
        });
        
        return formatted;
    }
    
    isSelfClosingTag(tagName) {
        const selfClosingTags = [
            'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
            'link', 'meta', 'param', 'source', 'track', 'wbr'
        ];
        const tagNameLower = tagName.split(' ')[0].toLowerCase();
        return selfClosingTags.includes(tagNameLower);
    }
    
    displayResult(result) {
        this.resultContainer.style.display = 'none';
        this.resultTextarea.style.display = 'block';
        this.resultTextarea.value = result;
        
        // Apply syntax highlighting if it's XML content
        this.applySyntaxHighlighting(result);
        
        // Add debug information to help troubleshoot
        const isXML = this.detectXMLContent(result);
        const isCSV = this.detectCSVContent(result.trim());
        const outputMethod = this.xsltOutputMethod || 'auto-detected';
        console.log('Transformation result analysis:', {
            contentLength: result.length,
            firstChars: result.substring(0, 100),
            isDetectedAsXML: isXML,
            isDetectedAsCSV: isCSV,
            xsltOutputMethod: outputMethod,
            hasOpeningTags: (result.match(/<[^\/!?][^>]*>/g) || []).length,
            hasClosingTags: (result.match(/<\/[^>]+>/g) || []).length,
            hasCommas: result.includes(','),
            lineCount: result.split('\n').length
        });
    }
    
    /**
     * Apply syntax highlighting to XML content
     * @param {string} content - The content to highlight
     */
    applySyntaxHighlighting(content) {
        // Enhanced XML detection logic
        const isXMLContent = this.detectXMLContent(content);
        
        if (isXMLContent) {
            try {
                const highlightedContent = this.highlightXML(content);
                
                // Create or update the highlighted display
                let highlightedDiv = document.getElementById('highlightedResult');
                if (!highlightedDiv) {
                    highlightedDiv = document.createElement('div');
                    highlightedDiv.id = 'highlightedResult';
                    highlightedDiv.className = 'highlighted-xml';
                    this.resultTextarea.parentNode.appendChild(highlightedDiv);
                }
                
                highlightedDiv.innerHTML = highlightedContent;
                highlightedDiv.style.display = 'block';
                this.resultTextarea.style.display = 'none';
                
                // Add toggle button if it doesn't exist
                this.addHighlightToggle();
                
            } catch (error) {
                console.warn('Failed to apply syntax highlighting:', error);
                // Fall back to plain text display
                this.resultTextarea.style.display = 'block';
            }
        } else {
            // Hide highlighted view for non-XML content
            const highlightedDiv = document.getElementById('highlightedResult');
            if (highlightedDiv) {
                highlightedDiv.style.display = 'none';
            }
            this.resultTextarea.style.display = 'block';
        }
    }
    
    /**
     * Enhanced XML content detection
     * @param {string} content - The content to analyze
     * @returns {boolean} - Whether the content appears to be XML
     */
    detectXMLContent(content) {
        const trimmedContent = content.trim();
        
        // Empty content is not XML
        if (!trimmedContent) return false;
        
        // Check for CSV content first (comma-separated values)
        if (this.detectCSVContent(trimmedContent)) {
            return false;
        }
        
        // Check for obvious non-XML content first
        if (trimmedContent.includes('<!DOCTYPE html') || 
            trimmedContent.includes('<html') ||
            trimmedContent.toLowerCase().includes('<html>')) {
            return false;
        }
        
        // Check for XML declaration
        if (trimmedContent.startsWith('<?xml')) {
            return true;
        }
        
        // Check if content has XML-like structure
        const hasXMLTags = /<[^>]+>/g.test(content);
        if (!hasXMLTags) return false;
        
        // More sophisticated XML detection
        try {
            // Count opening and closing tags
            const openingTags = (content.match(/<[^\/!?][^>]*>/g) || []).length;
            const closingTags = (content.match(/<\/[^>]+>/g) || []).length;
            const selfClosingTags = (content.match(/<[^>]*\/>/g) || []).length;
            
            // For XML, we expect roughly equal opening and closing tags (accounting for self-closing)
            const hasBalancedTags = Math.abs(openingTags - closingTags - selfClosingTags) <= 1;
            
            // Check for XML namespace indicators
            const hasNamespaces = content.includes('xmlns') || content.includes(':');
            
            // Check if the XSLT output method was XML
            const xsltOutputIsXML = this.xsltOutputMethod === 'xml' || this.xsltOutputMethod === null;
            
            // Check for common XML patterns
            const hasXMLPatterns = trimmedContent.startsWith('<') && 
                                  trimmedContent.endsWith('>') &&
                                  !trimmedContent.includes('<script') &&
                                  !trimmedContent.includes('<style') &&
                                  !trimmedContent.includes('<meta') &&
                                  !trimmedContent.includes('<link');
            
            // Determine if this is likely XML
            return hasBalancedTags && (hasNamespaces || xsltOutputIsXML || hasXMLPatterns);
            
        } catch (error) {
            console.warn('Error in XML detection:', error);
            
            // Fallback: basic tag detection
            return content.includes('<') && 
                   content.includes('>') && 
                   !content.includes('<html') && 
                   !content.includes('<!DOCTYPE html');
        }
    }
    
    /**
     * Detect if content appears to be CSV format
     * @param {string} content - The content to analyze
     * @returns {boolean} - Whether the content appears to be CSV
     */
    detectCSVContent(content) {
        const lines = content.split('\n').filter(line => line.trim().length > 0);
        if (lines.length === 0) return false;
        
        // Check if XSLT output method was explicitly set to text or csv
        if (this.xsltOutputMethod === 'text' || this.xsltOutputMethod === 'csv') {
            // For text/csv output, check if it looks like CSV
            const hasCommas = content.includes(',');
            const hasConsistentColumns = this.hasConsistentCSVStructure(lines);
            return hasCommas && hasConsistentColumns;
        }
        
        // General CSV detection
        const hasCommas = content.includes(',');
        const hasNoXMLTags = !/<[^>]+>/g.test(content);
        const hasConsistentColumns = this.hasConsistentCSVStructure(lines);
        
        return hasCommas && hasNoXMLTags && hasConsistentColumns && lines.length > 1;
    }
    
    /**
     * Check if lines have consistent CSV structure
     * @param {string[]} lines - Array of content lines
     * @returns {boolean} - Whether lines have consistent column count
     */
    hasConsistentCSVStructure(lines) {
        if (lines.length < 2) return false;
        
        const columnCounts = lines.slice(0, Math.min(5, lines.length)).map(line => {
            // Simple comma count (doesn't handle quoted commas, but good enough for detection)
            return (line.match(/,/g) || []).length + 1;
        });
        
        // Check if most lines have similar column counts
        const firstCount = columnCounts[0];
        const consistentLines = columnCounts.filter(count => Math.abs(count - firstCount) <= 1);
        
        return consistentLines.length >= Math.ceil(columnCounts.length * 0.7);
    }
    
    /**
     * Add toggle button to switch between highlighted and plain text view
     */
    addHighlightToggle() {
        if (document.getElementById('highlightToggle')) return;
        
        const cardHeader = this.resultTextarea.closest('.card').querySelector('.card-header');
        const downloadBtn = document.getElementById('downloadBtn');
        
        // Create button group container
        let buttonGroup = document.getElementById('resultButtonGroup');
        if (!buttonGroup) {
            buttonGroup = document.createElement('div');
            buttonGroup.id = 'resultButtonGroup';
            buttonGroup.className = 'btn-group';
            buttonGroup.setAttribute('role', 'group');
        }
        
        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'highlightToggle';
        toggleBtn.className = 'btn btn-light btn-sm';
        toggleBtn.innerHTML = '<i class="bi bi-code-slash me-1"></i>Raw';
        toggleBtn.title = 'Toggle between highlighted and raw text view';
        
        toggleBtn.addEventListener('click', () => {
            const highlightedDiv = document.getElementById('highlightedResult');
            const isHighlighted = highlightedDiv && highlightedDiv.style.display !== 'none';
            
            if (isHighlighted) {
                highlightedDiv.style.display = 'none';
                this.resultTextarea.style.display = 'block';
                toggleBtn.innerHTML = '<i class="bi bi-palette me-1"></i>Highlight';
                toggleBtn.title = 'Switch to highlighted view';
            } else {
                if (highlightedDiv) {
                    highlightedDiv.style.display = 'block';
                }
                this.resultTextarea.style.display = 'none';
                toggleBtn.innerHTML = '<i class="bi bi-code-slash me-1"></i>Raw';
                toggleBtn.title = 'Switch to raw text view';
            }
        });
        
        // Move download button and add toggle button to group
        if (downloadBtn && downloadBtn.parentNode === cardHeader) {
            downloadBtn.remove();
            downloadBtn.className = 'btn btn-light btn-sm';
        }
        
        buttonGroup.appendChild(toggleBtn);
        if (downloadBtn) {
            buttonGroup.appendChild(downloadBtn);
        }
        
        cardHeader.appendChild(buttonGroup);
    }
    
    /**
     * Apply XML syntax highlighting
     * @param {string} xmlString - The XML content to highlight
     * @returns {string} - HTML with syntax highlighting
     */
    highlightXML(xmlString) {
        // Log for debugging
        console.log('Applying XML highlighting to content:', xmlString.substring(0, 200) + '...');
        
        // Escape HTML entities first
        let highlighted = xmlString
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        
        // Apply syntax highlighting with regex patterns
        highlighted = highlighted
            // XML declaration and processing instructions
            .replace(/(&lt;\?[^&]*?\?&gt;)/g, '<span class="xml-declaration">$1</span>')
            
            // Comments
            .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="xml-comment">$1</span>')
            
            // CDATA sections
            .replace(/(&lt;!\[CDATA\[[\s\S]*?\]\]&gt;)/g, '<span class="xml-cdata">$1</span>')
            
            // Self-closing tags with attributes
            .replace(/(&lt;)([a-zA-Z][a-zA-Z0-9\-:]*)((?:\s+[a-zA-Z][a-zA-Z0-9\-:]*\s*=\s*(?:&quot;[^&]*?&quot;|&#39;[^&]*?&#39;))*)\s*(\/&gt;)/g, 
                function(match, openBracket, tagName, attributes, closeBracket) {
                    let result = '<span class="xml-bracket">' + openBracket + '</span>';
                    result += '<span class="xml-tag">' + tagName + '</span>';
                    
                    if (attributes) {
                        result += attributes.replace(
                            /([a-zA-Z][a-zA-Z0-9\-:]*)\s*=\s*((?:&quot;[^&]*?&quot;|&#39;[^&]*?&#39;))/g,
                            '<span class="xml-attribute">$1</span>=<span class="xml-value">$2</span>'
                        );
                    }
                    
                    result += '<span class="xml-bracket">' + closeBracket + '</span>';
                    return result;
                })
            
            // Opening tags with attributes
            .replace(/(&lt;)([a-zA-Z][a-zA-Z0-9\-:]*)((?:\s+[a-zA-Z][a-zA-Z0-9\-:]*\s*=\s*(?:&quot;[^&]*?&quot;|&#39;[^&]*?&#39;))*)\s*(&gt;)/g, 
                function(match, openBracket, tagName, attributes, closeBracket) {
                    let result = '<span class="xml-bracket">' + openBracket + '</span>';
                    result += '<span class="xml-tag">' + tagName + '</span>';
                    
                    if (attributes) {
                        result += attributes.replace(
                            /([a-zA-Z][a-zA-Z0-9\-:]*)\s*=\s*((?:&quot;[^&]*?&quot;|&#39;[^&]*?&#39;))/g,
                            '<span class="xml-attribute">$1</span>=<span class="xml-value">$2</span>'
                        );
                    }
                    
                    result += '<span class="xml-bracket">' + closeBracket + '</span>';
                    return result;
                })
            
            // Closing tags
            .replace(/(&lt;\/)([a-zA-Z][a-zA-Z0-9\-:]*)(&gt;)/g, 
                '<span class="xml-bracket">$1</span><span class="xml-tag">$2</span><span class="xml-bracket">$3</span>')
            
            // Text content between tags (improved pattern)
            .replace(/(&gt;)([^&<\n]+?)(&lt;)/g, function(match, openBracket, text, closeBracket) {
                const trimmedText = text.trim();
                if (trimmedText.length > 0) {
                    return openBracket + '<span class="xml-text">' + text + '</span>' + closeBracket;
                }
                return match;
            });
        
        return '<pre class="xml-highlighted">' + highlighted + '</pre>';
    }
    
    downloadResult() {
        if (!this.transformedResult) {
            this.showStatus('No transformation result available', 'danger');
            return;
        }
        
        try {
            let content = this.transformedResult;
            const baseName = this.xmlFile ? this.xmlFile.name.replace(/\.[^/.]+$/, '') : 'transformed';
            let filename, mimeType;
            
            // Check if original file was JDF for naming
            const isJDF = this.isJDFFile(this.xmlFile, this.xmlContent);
            const basePrefix = isJDF ? 'jdf' : 'xml';
            
            // Check for CSV content first
            if (this.detectCSVContent(content.trim())) {
                filename = `${baseName}_transformed.csv`;
                mimeType = 'text/csv';
                // CSV content should remain as-is, no XML declaration needed
            }
            // Use the detected XSLT output method to determine file type
            else if (this.xsltOutputMethod) {
                switch (this.xsltOutputMethod.toLowerCase()) {
                    case 'html':
                        filename = `${baseName}_transformed.html`;
                        mimeType = 'text/html';
                        break;
                    case 'csv':
                        filename = `${baseName}_transformed.csv`;
                        mimeType = 'text/csv';
                        // CSV content should remain as-is, no XML declaration needed
                        break;
                    case 'text':
                        // For text output, check if it's CSV-like
                        if (content.includes(',') && this.hasConsistentCSVStructure(content.split('\n'))) {
                            filename = `${baseName}_transformed.csv`;
                            mimeType = 'text/csv';
                        } else {
                            filename = `${baseName}_transformed.txt`;
                            mimeType = 'text/plain';
                        }
                        break;
                    case 'xml':
                    default:
                        // If original was JDF, keep JDF extension for XML output
                        const extension = isJDF ? 'jdf' : 'xml';
                        filename = `${baseName}_transformed.${extension}`;
                        mimeType = isJDF ? 'application/vnd.cip4-jdf+xml' : 'application/xml';
                        if (!content.trim().startsWith('<?xml')) {
                            content = '<?xml version="1.0" encoding="UTF-8"?>\n' + content;
                        }
                        content = this.formatXML(content);
                        break;
                }
            } else {
                // Fallback to content-based detection if no XSLT output method was found
                if (this.detectCSVContent(content.trim())) {
                    filename = `${baseName}_transformed.csv`;
                    mimeType = 'text/csv';
                } else if (content.includes('<html') || content.includes('<!DOCTYPE html')) {
                    filename = `${baseName}_transformed.html`;
                    mimeType = 'text/html';
                } else if (content.includes('<?xml') || content.includes('<')) {
                    // If original was JDF, keep JDF extension for XML-like output
                    const extension = isJDF ? 'jdf' : 'xml';
                    filename = `${baseName}_transformed.${extension}`;
                    mimeType = isJDF ? 'application/vnd.cip4-jdf+xml' : 'application/xml';
                    if (!content.trim().startsWith('<?xml')) {
                        content = '<?xml version="1.0" encoding="UTF-8"?>\n' + content;
                    }
                    content = this.formatXML(content);
                } else {
                    filename = `${baseName}_transformed.txt`;
                    mimeType = 'text/plain';
                }
            }
            
            const blob = new Blob([content], { 
                type: `${mimeType};charset=utf-8` 
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showStatus(`File "${filename}" downloaded successfully!`, 'success');
        } catch (error) {
            this.showStatus(`Download failed: ${error.message}`, 'danger');
        }
    }
    
    showStatus(message, type) {
        const alertClass = `alert-${type}`;
        const iconClass = type === 'success' ? 'bi bi-check-circle' : 
                         type === 'danger' ? 'bi bi-exclamation-circle' : 
                         'bi bi-info-circle';
        
        this.statusMessages.innerHTML = `
            <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                <i class="${iconClass} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        if (type === 'success') {
            setTimeout(() => {
                const alert = this.statusMessages.querySelector('.alert');
                if (alert) {
                    const bsAlert = new bootstrap.Alert(alert);
                    bsAlert.close();
                }
            }, 5000);
        }
    }
    
    showLoadingModal(show) {
        if (show) {
            this.loadingModal.show();
        } else {
            this.loadingModal.hide();
        }
    }
    
    clearAll() {
        this.xmlFileInput.value = '';
        this.xsltFileInput.value = '';
        
        this.xmlFileInput.classList.remove('is-valid', 'is-invalid');
        this.xsltFileInput.classList.remove('is-valid', 'is-invalid');
        
        this.xmlFile = null;
        this.xsltFile = null;
        this.xmlContent = null;
        this.xsltContent = null;
        this.transformedResult = null;
        this.xsltOutputMethod = null; // Clear the output method
        
        this.transformBtn.disabled = true;
        this.downloadBtn.disabled = true;
        
        this.resultContainer.style.display = 'block';
        this.resultTextarea.style.display = 'none';
        this.resultTextarea.value = '';
        
        // Clear highlighted display
        const highlightedDiv = document.getElementById('highlightedResult');
        if (highlightedDiv) {
            highlightedDiv.style.display = 'none';
            highlightedDiv.innerHTML = '';
        }
        
        // Remove button group (which contains both toggle and download buttons)
        const buttonGroup = document.getElementById('resultButtonGroup');
        if (buttonGroup) {
            buttonGroup.remove();
        }
        
        // Restore download button to its original position and styling
        const cardHeader = this.resultTextarea.closest('.card').querySelector('.card-header');
        if (cardHeader && !cardHeader.contains(this.downloadBtn)) {
            this.downloadBtn.className = 'btn btn-light btn-sm';
            cardHeader.appendChild(this.downloadBtn);
        }
        
        this.statusMessages.innerHTML = '';
        
        this.showStatus('All files and results cleared successfully', 'info');
    }
    
    initializeDarkMode() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }
    
    toggleDarkMode() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        localStorage.setItem('theme', newTheme);
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        if (theme === 'dark') {
            this.darkModeIcon.className = 'bi bi-sun-fill';
            this.darkModeToggle.title = 'Switch to light mode';
        } else {
            this.darkModeIcon.className = 'bi bi-moon-fill';
            this.darkModeToggle.title = 'Switch to dark mode';
        }
    }
}

function checkBrowserSupport() {
    if (!window.XSLTProcessor) {
        alert('Your browser does not support XSLT processing. Please use a modern browser like Chrome, Firefox, or Safari.');
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    new XSLTTransformer();
});

document.addEventListener('DOMContentLoaded', checkBrowserSupport);