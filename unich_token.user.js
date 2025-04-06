// ==UserScript==
// @name         UNICH Token 获取器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动获取并显示 UNICH 网站的 token
// @author       Your Name
// @match        https://unich.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 创建显示 token 的容器样式
    const style = document.createElement('style');
    style.textContent = `
        #token-container {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            max-width: 400px;
            word-break: break-all;
        }
        #token-container h3 {
            margin: 0 0 10px 0;
            color: #333;
        }
        #token-value {
            background: #f5f5f5;
            padding: 10px;
            border-radius: 3px;
            font-family: monospace;
            margin-bottom: 10px;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        #copy-button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 3px;
            cursor: pointer;
        }
        #copy-button:hover {
            background: #45a049;
        }
    `;
    document.head.appendChild(style);

    // 创建显示 token 的容器
    const container = document.createElement('div');
    container.id = 'token-container';
    container.innerHTML = `
        <h3>Token 信息</h3>
        <div id="token-value">等待获取 token...</div>
        <button id="copy-button">复制 Token</button>
    `;
    document.body.appendChild(container);

    // 添加复制功能
    document.getElementById('copy-button').addEventListener('click', function() {
        const token = document.getElementById('token-value').textContent;
        if (token && token !== '等待获取 token...') {
            navigator.clipboard.writeText(token).then(() => {
                alert('Token 已复制到剪贴板！');
            });
        }
    });

    // 使用 XMLHttpRequest 监听请求
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        xhr.open = function() {
            const url = arguments[1];
            if (url.includes('airdrop/user/v1/info/my-info')) {
                const originalSetRequestHeader = xhr.setRequestHeader;
                xhr.setRequestHeader = function(header, value) {
                    if (header.toLowerCase() === 'authorization') {
                        // 去掉 Bearer 前缀
                        const token = value.replace(/^Bearer\s+/i, '');
                        document.getElementById('token-value').textContent = token;
                    }
                    return originalSetRequestHeader.apply(this, arguments);
                };
            }
            return originalOpen.apply(this, arguments);
        };
        return xhr;
    };
})(); 