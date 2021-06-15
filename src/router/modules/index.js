const files = require.context('./', false, /^((?!index).)*\.js$/)
const modules = {}
files.keys().forEach(key => {
  const filename = key.replace(/(\.\/|\.js)/g, '')
  modules[filename] = files(key)['default']
})
export default modules