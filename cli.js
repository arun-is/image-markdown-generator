#!/usr/bin/env node

const fs = require("fs")
const { exposureTimeToHuman } = require("./converter.js")
const { promisify } = require("util")
const getExif = require("exif-async")
const path = require("path")
const readdirAsync = promisify(fs.readdir)

const cameraModelMap = {
  "LEICA Q (Typ 116)": "Leica Q"
}

const run = async () => {
  const args = process.argv.slice(2)

  if (args.length < 1) {
    console.error("no path provided")
    return
  }

  const directory = args[0]

  const files = await readdirAsync(directory)
  const filtered = files.filter((fileName) => fileName !== ".DS_Store")

  const markdownStrings = {}

  const promises = await filtered.map(async (fileName) => {
    let m
    try {
      m = await getExif(path.join(directory, fileName), true)
    } catch (e) {
      console.error(`problem with ${fileName}`)
    }
    const exif = m.exif
    const shutterSpeed = exposureTimeToHuman(exif.ExposureTime)
    const cameraModel = cameraModelMap[m.image.Model] || m.image.Model
    const imageString = `![](${fileName}) <span class="md-caption">${cameraModel} · ${exif.FocalLengthIn35mmFormat}mm · f/${exif.FNumber} · ${shutterSpeed} · ISO ${exif.ISO}</span>\n\n`

    markdownStrings[fileName] = imageString

    return m
  })

  await Promise.all(promises)

  filtered.forEach((fileName) => console.log(markdownStrings[fileName]))
}

run()
