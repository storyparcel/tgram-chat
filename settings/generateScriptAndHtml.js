const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const versions = [
    { name: 'dashboard', template: './dashboard/tgram-chat-template.html', outputDir: '../dist/dev/dashboard/static-files', environment: 'dev' },
    { name: 'dashboard', template: './dashboard/tgram-chat-template.html', outputDir: '../dist/prod/dashboard/static-files', environment: 'prod' },
    { name: 'anonymous', template: './anonymous/tgram-chat-template.html', outputDir: '../dist/dev/anonymous/static-files', environment: 'dev' },
    { name: 'anonymous', template: './anonymous/tgram-chat-template.html', outputDir: '../dist/prod/anonymous/static-files', environment: 'prod' },
];

const deleteFilesInDir = (dirPath) => {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach((file) => {
            const filePath = path.join(dirPath, file);
            if (fs.lstatSync(filePath).isDirectory()) {
                deleteFilesInDir(filePath);
            } else {
                fs.unlinkSync(filePath);
            }
        });
    }
};

versions.forEach(version => {
    const outputDir = path.resolve(__dirname, version.outputDir);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    } else {
        deleteFilesInDir(outputDir);
    }
});

const htmlTemplatePath = (version) => {
    return path.resolve(__dirname, `./${version.name}/tgram-chat-template.html`);
};

const getHtmlTemplateContent = (version) => {
    return fs.readFileSync(htmlTemplatePath(version), 'utf-8');
};

const loaderTemplatePath = (version) => {
    return path.resolve(__dirname, `./${version.name}/tgram-chat-loader-template.js`);
};

const getLoaderTemplateContent = (version) => {
    return fs.readFileSync(loaderTemplatePath(version), 'utf-8');
};

const generateHtmlFile = (version) => {
    const scriptUrl = `https://cdn.jsdelivr.net/gh/storyparcel/tgram-chat/dist/${version.environment}/${version.name}/main.js`;
    const outputFilePath = path.join(path.resolve(__dirname, version.outputDir), `tgram-chat.html`);
    const htmlContent = getHtmlTemplateContent(version).replace('{{SCRIPT_SRC}}', scriptUrl);
    fs.writeFileSync(outputFilePath, htmlContent, 'utf-8');
    console.log(`Generated ${outputFilePath}`);
    return outputFilePath;
};

const generateLoaderFile = (version, htmlFilePath) => {
    const scriptUrl = `https://cdn.jsdelivr.net/gh/storyparcel/tgram-chat/dist/${version.environment}/${version.name}/static-files/tgram-chat.html`;
    const loaderFilePath = path.join(path.resolve(__dirname, version.outputDir), `tgram-chat-loader.js`);
    const loaderContent = getLoaderTemplateContent(version).replace('{{IFRAME_SRC}}', scriptUrl);
    fs.writeFileSync(loaderFilePath, loaderContent, 'utf-8');
    console.log(`Generated ${loaderFilePath}`);
};

versions.forEach(version => {
    const htmlFilePath = generateHtmlFile(version);
    generateLoaderFile(version, htmlFilePath);
});