#!/usr/bin/env node

const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')
const {prompt} = require('enquirer')
const http = require('http')
const handler = require('serve-handler')
const open = require('open')

async function start() {
    let result = {}

    let response = await prompt({
        type: 'input',
        name: 'count',
        message: '下载的数量',
        initial: 30
    })
    result.count = parseInt(response.count)

    response = await prompt({
        type: 'select',
        name: 'job',
        message: '选择方向',
        choices: ['前端', 'Java', '后端', '测试', '产品经理', 'UI']
    })
    Object.assign(result, response)

    response = await prompt({
        type: 'select',
        name: 'company',
        message: '选择公司',
        choices: ['阿里巴巴', '字节跳动', '腾讯', '拼多多', '百度', '华为']
    })
    Object.assign(result, response)
    console.log(result)

    let page = 1
    let count = 0  //已经下载的数量
    let urls = []

    do {
        let url = `https://www.nowcoder.com/search?type=post&order=create&query=${result.company}+${result.job}&subType=2&tagId=&page=${page}`
        console.log(url)
        let res = await fetch(url)
        let body = await res.text()
        urls = body.match(/\/discuss\/\d+\?.+?"/g) || []
        urls = urls.map(text => `https://www.nowcoder.com${text.replace('"', '')}`)
        for (let i = 0; i < urls.length; i++) {
            console.log(`下载第${i}个`)
            fs.writeFileSync(path.join(process.cwd(), `${result.job}_${result.company}_${count}.html`), body, 'utf-8')
            count++
            if (count >= result.count) break
            await new Promise(resolve => setTimeout(resolve, 200))
        }
        page++
    } while (count < result.count && urls.length > 0)
    console.log('下载完毕')

    http.createServer(async (req, res) => {
        await handler(req, res)
    }).listen(3000, async () => {
        await open('http://localhost:3000')
    })
    console.log('打开http://localhost:3000')
}

start().then(r => r)

