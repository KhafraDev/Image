const { existsSync, readFileSync } = require('fs')
const { join } = require('path')

const { platform, arch } = process

let nativeBinding = null
let localFileExisted = false
let loadError = null

function isMusl() {
  // For Node 10
  if (!process.report || typeof process.report.getReport !== 'function') {
    try {
      const lddPath = require('child_process').execSync('which ldd').toString().trim();
      return readFileSync(lddPath, 'utf8').includes('musl')
    } catch (e) {
      return true
    }
  } else {
    const { glibcVersionRuntime } = process.report.getReport().header
    return !glibcVersionRuntime
  }
}

switch (platform) {
  case 'android':
    switch (arch) {
      case 'arm64':
        localFileExisted = existsSync(join(__dirname, 'image.android-arm64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./image.android-arm64.node')
          } else {
            nativeBinding = require('@napi-rs/image-android-arm64')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm':
        localFileExisted = existsSync(join(__dirname, 'image.android-arm-eabi.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./image.android-arm-eabi.node')
          } else {
            nativeBinding = require('@napi-rs/image-android-arm-eabi')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Android ${arch}`)
    }
    break
  case 'win32':
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(
          join(__dirname, 'image.win32-x64-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./image.win32-x64-msvc.node')
          } else {
            nativeBinding = require('@napi-rs/image-win32-x64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'ia32':
        localFileExisted = existsSync(
          join(__dirname, 'image.win32-ia32-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./image.win32-ia32-msvc.node')
          } else {
            nativeBinding = require('@napi-rs/image-win32-ia32-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(
          join(__dirname, 'image.win32-arm64-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./image.win32-arm64-msvc.node')
          } else {
            nativeBinding = require('@napi-rs/image-win32-arm64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Windows: ${arch}`)
    }
    break
  case 'darwin':
    localFileExisted = existsSync(join(__dirname, 'image.darwin-universal.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require('./image.darwin-universal.node')
      } else {
        nativeBinding = require('@napi-rs/image-darwin-universal')
      }
      break
    } catch {}
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(join(__dirname, 'image.darwin-x64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./image.darwin-x64.node')
          } else {
            nativeBinding = require('@napi-rs/image-darwin-x64')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(
          join(__dirname, 'image.darwin-arm64.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./image.darwin-arm64.node')
          } else {
            nativeBinding = require('@napi-rs/image-darwin-arm64')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on macOS: ${arch}`)
    }
    break
  case 'freebsd':
    if (arch !== 'x64') {
      throw new Error(`Unsupported architecture on FreeBSD: ${arch}`)
    }
    localFileExisted = existsSync(join(__dirname, 'image.freebsd-x64.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require('./image.freebsd-x64.node')
      } else {
        nativeBinding = require('@napi-rs/image-freebsd-x64')
      }
    } catch (e) {
      loadError = e
    }
    break
  case 'linux':
    switch (arch) {
      case 'x64':
        if (isMusl()) {
          localFileExisted = existsSync(
            join(__dirname, 'image.linux-x64-musl.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./image.linux-x64-musl.node')
            } else {
              nativeBinding = require('@napi-rs/image-linux-x64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, 'image.linux-x64-gnu.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./image.linux-x64-gnu.node')
            } else {
              nativeBinding = require('@napi-rs/image-linux-x64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm64':
        if (isMusl()) {
          localFileExisted = existsSync(
            join(__dirname, 'image.linux-arm64-musl.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./image.linux-arm64-musl.node')
            } else {
              nativeBinding = require('@napi-rs/image-linux-arm64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, 'image.linux-arm64-gnu.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./image.linux-arm64-gnu.node')
            } else {
              nativeBinding = require('@napi-rs/image-linux-arm64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm':
        localFileExisted = existsSync(
          join(__dirname, 'image.linux-arm-gnueabihf.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./image.linux-arm-gnueabihf.node')
          } else {
            nativeBinding = require('@napi-rs/image-linux-arm-gnueabihf')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Linux: ${arch}`)
    }
    break
  default:
    throw new Error(`Unsupported OS: ${platform}, architecture: ${arch}`)
}

if (!nativeBinding) {
  if (loadError) {
    throw loadError
  }
  throw new Error(`Failed to load native binding`)
}

const { ChromaSubsampling, FastResizeFilter, ResizeFit, compressJpegSync, compressJpeg, CompressionType, FilterType, PngRowFilter, losslessCompressPngSync, losslessCompressPng, pngQuantizeSync, pngQuantize, Orientation, ResizeFilterType, JsColorType, Transformer } = nativeBinding

module.exports.ChromaSubsampling = ChromaSubsampling
module.exports.FastResizeFilter = FastResizeFilter
module.exports.ResizeFit = ResizeFit
module.exports.compressJpegSync = compressJpegSync
module.exports.compressJpeg = compressJpeg
module.exports.CompressionType = CompressionType
module.exports.FilterType = FilterType
module.exports.PngRowFilter = PngRowFilter
module.exports.losslessCompressPngSync = losslessCompressPngSync
module.exports.losslessCompressPng = losslessCompressPng
module.exports.pngQuantizeSync = pngQuantizeSync
module.exports.pngQuantize = pngQuantize
module.exports.Orientation = Orientation
module.exports.ResizeFilterType = ResizeFilterType
module.exports.JsColorType = JsColorType
module.exports.Transformer = Transformer
