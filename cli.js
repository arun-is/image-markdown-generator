#!/usr/bin/env node

const fs = require("fs")
const { exposureTimeToHuman } = require("./converter.js")
const { promisify } = require("util")
const getExif = require("exif-async")
const path = require("path")
const readdirAsync = promisify(fs.readdir)

const run = async () => {
  const args = process.argv.slice(2)

  if (args.length !== 1) {
    console.error("no path provided")
    return
  }

  const directory = args[0]

  const files = await readdirAsync(directory)

  await files.sort().forEach(async fileName => {
    const m = await getExif(path.join(directory, fileName), true)
    const shutterSpeed = exposureTimeToHuman(m.exif.ExposureTime)

    const imageString = `![](${fileName}) <span class="f5 db tr o-40 nb3">Leica Q · f/${m.exif.FNumber} · ${shutterSpeed} · ISO ${m.exif.ISO}</span>\n\n<br><br>\n\n`

    console.log(imageString)
  })
}

run()
