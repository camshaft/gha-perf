import * as core from '@actions/core'
import {install} from './install'

async function run(): Promise<void> {
  try {
    const version: string = core.getInput('version')

    await install(version)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error)
    } else {
      core.setFailed(`${error}`)
    }
  }
}

run()
