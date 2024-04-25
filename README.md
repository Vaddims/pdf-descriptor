# PDF Descriptor

This project is an automation tool designed to extract and describe the contents of a PDF file. It is primarily used to test a specific theory related to a work task. The descriptions are saved in the `./runtime` folder under the name `result-output`.

## Prerequisites

Before you begin, ensure that the following packages are installed on your system:

- **GraphicsMagick and Ghostscript:**
Install these using Homebrew with the following 
```bash
brew install gs graphicsmagick
```
- Ollama is required to pull and serve machine learning models.
```bash
ollama serve
ollama pull llama3
```

## Installation

### Clone the Repository
To get started, clone the repository from GitHub using the command below:

```bash
git clone https://github.com/Vaddims/pdf-descriptor.git
```

Navigate to the project directory:

```bash
cd <project_directory>
```

Install the necessary JavaScript dependencies and run the application:

```bash
npm install
node index.js <absolute_path_to_pdf>
```

Replace <absolute_path_to_pdf> with the absolute path to the PDF you want to analyze.

## Output

The application will generate a description of the input PDF and save it in the `./runtime` folder with the filename `result-output`.

