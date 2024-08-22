// script.js

function convertToBib() {
    const format = document.getElementById('formatSelect').value;
    const reference = document.getElementById('referenceInput').value.trim();
    let bibtexEntry = '';

    switch (format) {
        case 'apa':
            bibtexEntry = convertAPAtoBib(reference);
            break;
        case 'ieee':
            bibtexEntry = convertIEEEtoBib(reference);
            break;
        case 'harvard':
            bibtexEntry = convertHarvardToBib(reference);
            break;
        case 'mla':
            bibtexEntry = convertMLAtoBib(reference);
            break;
        case 'chicago':
            bibtexEntry = convertChicagotoBib(reference);
            break;
        case 'vancouver':
            bibtexEntry = convertVancouverToBib(reference);
            break;
        case 'cse':
            bibtexEntry = convertCSEtoBib(reference);
            break;
        case 'acs':
            bibtexEntry = convertACStoBib(reference);
            break;
        default:
            bibtexEntry = 'Unsupported format';
    }

    document.getElementById('bibtexOutput').value = bibtexEntry;
}

// Add escape function to handle special characters in BibTeX
function escapeBibtex(str) {
    return str
        .replace(/\\/g, '\\\\')
        .replace(/{/g, '\\{')
        .replace(/}/g, '\\}')
        .replace(/"/g, '\\"')
        .replace(/_/g, '\\_');
}

// Add conversion functions for new formats

function convertMLAtoBib(reference) {
    const regex = /^(.+)\. (.+). (.+), (\d{4})\.$/;
    const match = reference.match(regex);

    if (match) {
        const author = escapeBibtex(match[1]);
        const title = escapeBibtex(match[2]);
        const publisher = escapeBibtex(match[3]);
        const year = match[4];

        return `@book{${author.split(' ').join('')}${year},
  author       = {${author}},
  title        = {${title}},
  publisher    = {${publisher}},
  year         = {${year}},
}`;
    }
    return 'Invalid MLA format. Please use the format: Author. Title. Publisher, Year.';
}

function convertChicagotoBib(reference) {
    const regex = /^(.+)\. (.+). (.+): (.+), (\d{4})\.$/;
    const match = reference.match(regex);

    if (match) {
        const author = escapeBibtex(match[1]);
        const title = escapeBibtex(match[2]);
        const publisher = escapeBibtex(match[3]);
        const city = escapeBibtex(match[4]);
        const year = match[5];

        return `@book{${author.split(' ').join('')}${year},
  author       = {${author}},
  title        = {${title}},
  publisher    = {${publisher}},
  address      = {${city}},
  year         = {${year}},
}`;
    }
    return 'Invalid Chicago format. Please use the format: Author. Title. Publisher: City, Year.';
}

function convertVancouverToBib(reference) {
    const regex = /^(.+)\. (.+). (.+). (.+). (\d{4})\.$/;
    const match = reference.match(regex);

    if (match) {
        const author = escapeBibtex(match[1]);
        const title = escapeBibtex(match[2]);
        const journal = escapeBibtex(match[3]);
        const volume = escapeBibtex(match[4]);
        const year = match[5];

        return `@article{${author.split(' ').join('')}${year},
  author       = {${author}},
  title        = {${title}},
  journal      = {${journal}},
  volume       = {${volume}},
  year         = {${year}},
}`;
    }
    return 'Invalid Vancouver format. Please use the format: Author. Title. Journal. Volume, Year.';
}

function convertCSEtoBib(reference) {
    const regex = /^(.+), (\d{4})\. (.+). (.+), (\d+): (\d+)-(\d+)\.$/;
    const match = reference.match(regex);

    if (match) {
        const author = escapeBibtex(match[1]);
        const year = match[2];
        const title = escapeBibtex(match[3]);
        const journal = escapeBibtex(match[4]);
        const volume = match[5];
        const startPage = match[6];
        const endPage = match[7];

        return `@article{${author.split(' ').join('')}${year},
  author       = {${author}},
  title        = {${title}},
  journal      = {${journal}},
  volume       = {${volume}},
  pages        = {${startPage}-${endPage}},
  year         = {${year}},
}`;
    }
    return 'Invalid CSE format. Please use the format: Author, Year. Title. Journal, Volume: StartPage-EndPage.';
}

function convertACStoBib(reference) {
    const regex = /^(.+)\. (.+). (.+), (\d{4})\.$/;
    const match = reference.match(regex);

    if (match) {
        const author = escapeBibtex(match[1]);
        const title = escapeBibtex(match[2]);
        const journal = escapeBibtex(match[3]);
        const year = match[4];

        return `@article{${author.split(' ').join('')}${year},
  author       = {${author}},
  title        = {${title}},
  journal      = {${journal}},
  year         = {${year}},
}`;
    }
    return 'Invalid ACS format. Please use the format: Author. Title. Journal, Year.';
}

function generateBibFromDOI() {
    const doi = document.getElementById('doiInput').value.trim();
    if (!doi) {
        document.getElementById('bibtexOutput').value = 'Please enter a DOI';
        return;
    }

    const url = `https://api.crossref.org/works/${encodeURIComponent(doi)}/transform/application/x-bibtex`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(data => {
            document.getElementById('bibtexOutput').value = data;
        })
        .catch(error => {
            document.getElementById('bibtexOutput').value = 'Failed to retrieve BibTeX entry from DOI';
            console.error('Error:', error);
        });
}

function generateBibFile() {
    const bibtexContent = document.getElementById('bibtexOutput').value.trim();
    if (!bibtexContent) {
        alert('No BibTeX entry to download');
        return;
    }

    const blob = new Blob([bibtexContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'reference.bib';
    link.click();
}
