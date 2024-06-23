const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const versions = [
    { name: 'dashboard', template: './dashboard/tgram-chat-template.html', outputDir: '../public/dev/dashboard', environment: 'dev' },
    { name: 'dashboard', template: './dashboard/tgram-chat-template.html', outputDir: '../public/prod/dashboard', environment: 'prod' },
    { name: 'anonymous', template: './anonymous/tgram-chat-template.html', outputDir: '../public/dev/anonymous', environment: 'dev' },
    { name: 'anonymous', template: './anonymous/tgram-chat-template.html', outputDir: '../public/prod/anonymous', environment: 'prod' },
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
    const bundleFileName = getVersionedBundleFileName(version);
    const scriptUrl = `https://cdn.jsdelivr.net/gh/storyparcel/tgram-chat/dist/${version.environment}/${version.name}/${bundleFileName}`;
    const outputFilePath = path.join(path.resolve(__dirname, version.outputDir), `tgram-chat.${getBundleFileHash(version)}.html`);
    const htmlContent = getHtmlTemplateContent(version).replace('{{SCRIPT_SRC}}', scriptUrl);
    fs.writeFileSync(outputFilePath, htmlContent, 'utf-8');
    console.log(`Generated ${outputFilePath}`);
};


const generateLoaderFile = (version) => {
    const scriptUrl = `https://cdn.jsdelivr.net/gh/storyparcel/tgram-chat/public/${version.environment}/${version.name}/tgram-chat.html`;
    const loaderFilePath = path.join(path.resolve(__dirname, version.outputDir), `tgram-chat-loader.${getBundleFileHash(version)}.js`);
    const loaderContent = getLoaderTemplateContent(version).replace('{{IFRAME_SRC}}', scriptUrl);
    fs.writeFileSync(loaderFilePath, loaderContent, 'utf-8');
    console.log(`Generated ${loaderFilePath}`);
};

versions.forEach(version => {
    generateHtmlFile(version);
    generateLoaderFile(version);
});

function getVersionedBundleFileName(version) {
    const files = fs.readdirSync(path.resolve(__dirname, `../dist/${version.environment}/${version.name}`));
    const bundleRegex = /^main\.[a-f0-9]+\.js$/;
    const bundleFile = files.find(file => bundleRegex.test(file));
    if (!bundleFile) {
        throw new Error(`Bundle file not found for ${version.name}`);
    }
    return bundleFile;
}

function getBundleFileHash(version) {
    const bundleFileName = getVersionedBundleFileName(version);
    const bundleFilePath = path.resolve(__dirname, `../dist/${version.environment}/${version.name}/${bundleFileName}`);
    const buffer = fs.readFileSync(bundleFilePath);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const lenHash = 10;
    return hash.substring(0, lenHash);
}
