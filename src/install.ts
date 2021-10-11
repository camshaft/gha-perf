import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'
import fs from 'fs'
import path from 'path'

export async function install(version: string): Promise<string> {
  if (version === 'native') {
    version = await resolveNative()
  }

  if (version !== 'master') {
    version = version.replace(/^v/, '')
  }

  let cachedPath = tc.find('perf', version)

  if (!cachedPath) {
    const url = `https://camshaft.github.io/gha-perf/v${version}/perf`
    core.info(`Installing perf from ${url}`)

    const binPath = await tc.downloadTool(url)

    cachedPath = await tc.cacheFile(binPath, 'perf', 'perf', version)
  }

  core.info(`adding ${cachedPath} to the executable path`)

  core.addPath(cachedPath)

  const bin = path.join(cachedPath, 'perf')

  // make sure it's actually executable
  await chmodx(bin)

  return bin
}

async function resolveNative(): Promise<string> {
  let out = ''
  await exec.exec('uname', ['-r'], {
    listeners: {
      stdout(buffer) {
        out += buffer.toString()
      }
    }
  })
  return out.replace(/ /g, '').split('.').slice(0, 2).join('.')
}

async function chmodx(bin: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.chmod(bin, 0o775, err => (err ? reject(err) : resolve(void 0)))
  })
}
