// ==UserScript==
// @name         必应首页自定义背景图片
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  在必应首页左下角添加按钮, 允许用户自定义背景图片
// @author       Ctory-Nily
// @match        https://www.bing.com/*
// @match        https://www.bing.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        GM_addStyle
// ==/UserScript==

(function(window, document) {
    'use strict';

    // 永久删除元素并监控重新出现
    function permanentlyRemoveElement() {
        const targetSelector = ".musCard";

        // 初始删除
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
            targetElement.remove();
        }

        // 设置MutationObserver监控DOM变化
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    // 检查新增节点或子节点是否匹配目标元素
                    if (node.matches && node.matches(targetSelector)) {
                        node.remove();
                    }
                    if (node.querySelectorAll) {
                        const elements = node.querySelectorAll(targetSelector);
                        elements.forEach(el => {
                            el.remove();
                        });
                    }
                });
            });
        });

        // 开始监控整个文档的DOM变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 额外检查：定时检查（应对某些特殊情况）
        setInterval(() => {
            const elements = document.querySelectorAll(targetSelector);
            elements.forEach(el => {
                el.remove();
                console.log("定时检查发现元素，已删除");
            });
        }, 1000);
    }

    // 等待页面加载完成
    window.addEventListener('load', function() {

        // 永久删除元素
        permanentlyRemoveElement();

        // 创建主容器
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'ms-custom-bg-widget';

        // 创建上传按钮
        const uploadBtn = document.createElement('button');
        uploadBtn.id = 'ms-custom-bg-btn';

        // 创建图标
        const icon = document.createElement('span');
        icon.id = 'ms-btn-icon';
        icon.innerHTML = '<svg t="1745479704533" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9867" width="20" height="20"><path d="M903.68 919.381333c53.418667 0 96.682667-43.264 96.682667-96.597333 0-35.584-32.256-110.762667-96.682667-225.450667-64.341333 114.688-96.597333 189.866667-96.597333 225.450667 0 53.333333 43.264 96.597333 96.597333 96.597333z" fill="#ffffff" p-id="9868"></path><path d="M510.037333 171.52l331.946667 331.946667a85.333333 85.333333 0 0 1 0 120.576l-331.946667 331.946666a85.333333 85.333333 0 0 1-120.661333 0L57.514667 623.957333a85.333333 85.333333 0 0 1 0-120.661333L365.226667 195.669333l-18.090667-18.090666a59.733333 59.733333 0 1 1 84.48-84.48l78.506667 78.506666z m-343.893333 392.192L449.706667 847.36l283.648-283.648L449.706667 280.149333 166.144 563.712z" fill="#ffffff" p-id="9869"></path><path d="M793.258667 564.48l-362.069334 361.984L69.12 564.48z" fill="#ffffff" p-id="9870"></path></svg>';
        uploadBtn.appendChild(icon);

        // 创建恢复默认按钮
        const resetBtn = document.createElement('button');
        resetBtn.id = 'ms-reset-bg-btn';

        // 创建恢复图标
        const resetIcon = document.createElement('span');
        resetIcon.id = 'ms-btn-icon';
        resetIcon.innerHTML = '<svg t="1745479925452" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11737" width="20" height="20"><path d="M716.8 290.133333c-110.933333-102.4-281.6-106.666667-396.8-12.8S170.666667 537.6 247.466667 665.6c59.733333 106.666667 179.2 166.4 302.933333 149.333333s221.866667-102.4 256-221.866666c8.533333-34.133333 42.666667-51.2 76.8-42.666667 34.133333 8.533333 51.2 42.666667 42.666667 76.8-68.266667 226.133333-302.933333 354.133333-524.8 290.133333C174.933333 853.333333 42.666667 618.666667 106.666667 392.533333c42.666667-145.066667 153.6-256 298.666666-298.666666s298.666667 0 405.333334 102.4l81.066666-81.066667c8.533333-8.533333 21.333333-12.8 34.133334-8.533333 4.266667 12.8 12.8 21.333333 12.8 34.133333v264.533333c0 17.066667-12.8 29.866667-29.866667 29.866667h-260.266667c-12.8 0-25.6-8.533333-29.866666-17.066667s0-25.6 8.533333-34.133333l89.6-93.866667z" p-id="11738" fill="#ffffff"></path></svg>';
        resetBtn.appendChild(resetIcon);

        // 创建文件输入元素
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        // 点击按钮触发文件选择
        uploadBtn.addEventListener('click', () => {
            fileInput.click();
        });

        // 处理文件选择
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // 检查文件大小（限制为2MB）
                if (file.size > 2 * 1024 * 1024) {
                    alert('图片大小不能超过2MB');
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(event) {
                    const imageUrl = event.target.result;
                    applyBackground(imageUrl);
                    localStorage.setItem('microsoftCustomBackground', imageUrl);
                };
                reader.readAsDataURL(file);
            }
        });

        // 恢复默认背景
        resetBtn.addEventListener('click', () => {
            if (confirm('确定要恢复默认背景吗？')) {
                localStorage.removeItem('microsoftCustomBackground');
                resetBackground();
            }
        });

        // 添加到页面
        widgetContainer.appendChild(uploadBtn);
        widgetContainer.appendChild(resetBtn);
        document.body.appendChild(widgetContainer);
        document.body.appendChild(fileInput);

        // 检查并应用存储的背景
        const savedBackground = localStorage.getItem('microsoftCustomBackground');
        if (savedBackground) {
            applyBackground(savedBackground);
        }

        /**
         * 应用背景图片到指定元素
         * @param {string} imageUrl - 图片URL
         */
        function applyBackground(imageUrl) {
            const elements = [
                document.querySelector(".img_cont"),
                document.querySelector(".hp_top_cover")
            ];

            elements.forEach(el => {
                if (el) el.style.backgroundImage = `url(${imageUrl})`;
            });
        }

        /**
         * 重置背景为默认
         */
        function resetBackground() {
            const elements = [
                document.querySelector(".img_cont"),
                document.querySelector(".hp_top_cover")
            ];

            elements.forEach(el => {
                if (el) el.style.backgroundImage = '';
            });

            setTimeout(() => location.reload(), 300);
        }
    });

    // 使用GM_addStyle添加CSS样式
    GM_addStyle(`
        #ms-custom-bg-widget {
            position: fixed;
            left: 0;
            bottom: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        #ms-custom-bg-btn {
            padding: 10px;
            background: transparent;
            color: white;
            border: none;
            border-radius: 0 4px 4px 0;
            font-family: 'Segoe UI', sans-serif;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            width: 40px;
            height: 40px;
            overflow: hidden;
            white-space: nowrap;
            position: relative;
        }

        #ms-custom-bg-btn:hover {
            width: 120px;
            background: rgba(0, 120, 212, 0.7);
        }

        #ms-custom-bg-btn::before {
            content: '上传背景';
            position: absolute;
            left: 40px;
            top: 10px;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        #ms-custom-bg-btn:hover::before {
            opacity: 1;
        }

        #ms-btn-icon {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 20px;
        }

        #ms-reset-bg-btn {
            padding: 10px;
            background: transparent;
            color: white;
            border: none;
            border-radius: 0 4px 4px 0;
            font-family: 'Segoe UI', sans-serif;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            margin-top: 5px;
            width: 40px;
            height: 40px;
            overflow: hidden;
            white-space: nowrap;
            position: relative;
        }

        #ms-reset-bg-btn:hover {
            width: 120px;
            background: rgba(40, 40, 40, 0.7);
        }

        #ms-reset-bg-btn::before {
            content: '恢复默认';
            position: absolute;
            left: 40px;
            top: 10px;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        #ms-reset-bg-btn:hover::before {
            opacity: 1;
        }

        #scroll_cont {
            margin-top: 47px !important;
        }
    `);
})(window, document);