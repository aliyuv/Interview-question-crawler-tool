#!/usr/bin/env node
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

let job = '前端'
let company = '腾讯'

async function start() {
    let url = `https://www.nowcoder.com/search?type=post&order=recall&query=${company}+${job}&subType=2&tagId=&page=2`
    let res = await fetch(url);
    let body = await res.text();
    console.log(body);

    fs.writeFileSync(path.join(process.cwd(), `${job}_${company}_1.html`), body, 'utf-8')
}

start()
