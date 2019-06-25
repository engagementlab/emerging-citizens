module.exports = {

  options: {
    files: ['package.json'],
    commit: true,
    commitMessage: 'Production Release v%VERSION%',
    commitFiles: ['package.json'],
    createTag: true,
    tagName: 'v%VERSION%',
    tagMessage: 'Version %VERSION%',
    push: true,
    pushTo: 'origin'
  }
      
};
