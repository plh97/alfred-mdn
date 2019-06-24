'use strict';
const fetch = require('node-fetch');
const {
  JSDOM
} = require("jsdom");

fetch(`https://developer.mozilla.org/zh-CN/search?q=${process.argv[2]}`)
  .then(response => response.text())
  .then(data => {
    data = data.replace(/\<head\>(\w|\W)+<\/head>/, "")
    const {
      document
    } = (new JSDOM(data)).window;
    data = [...document.querySelectorAll('.result-list-item')].map(e => ({
      title: e.querySelector('h4 a').textContent,
      href: e.querySelector('h4 a').href,
      description: e.querySelector('p').textContent
    })).map(item => ({
      title: `${item.title}`,
      subtitle: item.description,
      arg: item.href,
      text: {
        copy: item.href,
        largetype: item.description
      },
    }));
    let items = {
      items: data
    }
    console.log(JSON.stringify(items));
  })
  .catch(error => {
    console.log(JSON.stringify({
      items: [{
        title: error.name,
        subtitle: error.message,
        valid: false,
        text: {
          copy: error.stack
        }
      }]
    }));
  });
