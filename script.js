let editor;
let currentEditorLanguage = 'javascript';

require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.29.0/min/vs' } });

require(['vs/editor/editor.main'], function () {
    initializeEditor(currentEditorLanguage, '');
});

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
    toggleCommentBlocks();
}

function changeEditor() {
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



function changeTheme() {
    const themeSelect = document.getElementById('themeSelect');
    const selectedTheme = themeSelect.value;
    monaco.editor.setTheme(selectedTheme);
}

function toggleLineNumbers() {
    const lineNumbersCheckbox = document.getElementById('lineNumbersCheckbox');
    const showLineNumbers = lineNumbersCheckbox.checked;
    editor.updateOptions({ lineNumbers: showLineNumbers });
}

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

    const exportFileName = prompt('Enter a file name:', `exported-code.${fileExtensionMap[selectedLanguage]}`);

    if (exportFileName !== null) {
        const blob = new Blob([codeToExport], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = exportFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

function importCode() {
    const input = document.getElementById('importInput');
    input.click();

    input.addEventListener('change', function () {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const importedCode = e.target.result;
                editor.setValue(importedCode);
            };
            reader.readAsText(file);
        }
    });
}