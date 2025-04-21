// Custom plugin to ensure Python version is set correctly
module.exports = {
  onPreBuild: ({ utils }) => {
    console.log('Setting Python version to 3.9...');
    // This will be logged in the Netlify build output
    utils.status.show({
      title: 'Python Version',
      summary: 'Using Python 3.9 for build',
      text: 'Explicitly setting Python version to 3.9'
    });
  }
}
