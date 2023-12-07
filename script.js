// Initialize variables
let editor;
let currentEditorLanguage = 'javascript';

// Configure Monaco Editor library
require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.29.0/min/vs' } });

// Load the Monaco Editor and initialize with default language (JavaScript) and empty code
require(['vs/editor/editor.main'], function () {
    initializeEditor(currentEditorLanguage, '');
});

// Function to initialize the code editor with specific language and code
function initializeEditor(language, code) {
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: code,
        language: language,
        theme: 'vs-dark',
        automaticLayout: true,
        folding: true, // Enable folding (collapsible code blocks)
        lineNumbers: true, // Display line numbers
        minimap: { enabled: false }, // Disable minimap for simplicity
        scrollbar: { vertical: 'auto', horizontal: 'auto' } // Adjust scrollbar behavior
    });

    // Set initial options
    toggleLineNumbers();
}

// Function to change the language of the code editor
function changeEditor() {
    // Get the selected language from the dropdown
    const languageSelect = document.getElementById('languageSelect');
    const selectedLanguage = languageSelect.value;

    // Get the current code in the editor
    const code = editor.getValue();

    // Dispose of the current editor
    editor.dispose();

    // Initialize the new editor with the selected language and the existing code
    initializeEditor(selectedLanguage, code);

    // Set the current language
    currentEditorLanguage = selectedLanguage;

    // Ensure the selected editor has focus
    editor.focus();
}

// Function to change the theme of the code editor
function changeTheme() {
    const themeSelect = document.getElementById('themeSelect');
    const selectedTheme = themeSelect.value;
    monaco.editor.setTheme(selectedTheme);
}

// Function to toggle line numbers in the code editor
function toggleLineNumbers() {
    const lineNumbersCheckbox = document.getElementById('lineNumbersCheckbox');
    const showLineNumbers = lineNumbersCheckbox.checked;
    editor.updateOptions({ lineNumbers: showLineNumbers });
}

// Function to export code as a file
function exportCode() {
    const codeToExport = editor.getValue();

    // Get the selected language
    const languageSelect = document.getElementById('languageSelect');
    const selectedLanguage = languageSelect.value;

    // Define a map for file extensions based on language
    const fileExtensionMap = {
        'cpp': 'cpp',
        'csharp': 'cs',
        'javascript': 'js',
        'python': 'py'
    };

    // Prompt user for file name
    const exportFileName = prompt('Enter a file name:', `exported-code.${fileExtensionMap[selectedLanguage]}`);

    if (exportFileName !== null) {
        // Create a Blob with the code and initiate download
        const blob = new Blob([codeToExport], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = exportFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

// Function to import code from a file
function importCode() {
    const input = document.getElementById('importInput');
    input.click();

    // Event listener for file input change
    input.addEventListener('change', function () {
        const file = input.files[0];
        if (file) {
            // Read the file and set the code in the editor
            const reader = new FileReader();
            reader.onload = function (e) {
                const importedCode = e.target.result;
                editor.setValue(importedCode);
            };
            reader.readAsText(file);
        }
    });
}
