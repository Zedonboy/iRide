const nativeAddon = require("")
const exportObject = {
    registerService : () => {
        nativeAddon.registerService()
    },
    closestService : () => {
        nativeAddon.closestService()
    }
}

module.exports = exportObject