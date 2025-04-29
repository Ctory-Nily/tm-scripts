// ==UserScript==
// @name         Bing 自定义背景图片
// @namespace    http://tampermonkey.net/
// @version      0.9.5
// @description  在必应首页左下角添加按钮, 允许用户自定义背景图片
// @author       Ctory-Nily
// @match        https://www.bing.com/*
// @match        https://cn.bing.com/*
// @match        https://www.bing.com/
// @match        https://cn.bing.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮容器
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'bg-controls';

    // 创建上传按钮
    const uploadBtn = document.createElement('button');
    uploadBtn.id = 'ms-custom-bg-btn';

    // 创建图标
    const icon = document.createElement('span');
    icon.id = 'ms-btn-icon';
    icon.innerHTML = '<svg t="1745479704533" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9867" width="20" height="20"><path d="M903.68 919.381333c53.418667 0 96.682667-43.264 96.682667-96.597333 0-35.584-32.256-110.762667-96.682667-225.450667-64.341333 114.688-96.597333 189.866667-96.597333 225.450667 0 53.333333 43.264 96.597333 96.597333 96.597333z" fill="#ffffff" p-id="9868"></path><path d="M510.037333 171.52l331.946667 331.946667a85.333333 85.333333 0 0 1 0 120.576l-331.946667 331.946666a85.333333 85.333333 0 0 1-120.661333 0L57.514667 623.957333a85.333333 85.333333 0 0 1 0-120.661333L365.226667 195.669333l-18.090667-18.090666a59.733333 59.733333 0 1 1 84.48-84.48l78.506667 78.506666z m-343.893333 392.192L449.706667 847.36l283.648-283.648L449.706667 280.149333 166.144 563.712z" fill="#ffffff" p-id="9869"></path><path d="M793.258667 564.48l-362.069334 361.984L69.12 564.48z" fill="#ffffff" p-id="9870"></path></svg>';
    uploadBtn.appendChild(icon);
    controlsDiv.appendChild(uploadBtn);

    // 创建恢复默认按钮
    const resetBtn = document.createElement('button');
    resetBtn.id = 'ms-reset-bg-btn';

    // 创建恢复图标
    const resetIcon = document.createElement('span');
    resetIcon.id = 'ms-btn-icon';
    resetIcon.innerHTML = '<svg t="1745479925452" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11737" width="20" height="20"><path d="M716.8 290.133333c-110.933333-102.4-281.6-106.666667-396.8-12.8S170.666667 537.6 247.466667 665.6c59.733333 106.666667 179.2 166.4 302.933333 149.333333s221.866667-102.4 256-221.866666c8.533333-34.133333 42.666667-51.2 76.8-42.666667 34.133333 8.533333 51.2 42.666667 42.666667 76.8-68.266667 226.133333-302.933333 354.133333-524.8 290.133333C174.933333 853.333333 42.666667 618.666667 106.666667 392.533333c42.666667-145.066667 153.6-256 298.666666-298.666666s298.666667 0 405.333334 102.4l81.066666-81.066667c8.533333-8.533333 21.333333-12.8 34.133334-8.533333 4.266667 12.8 12.8 21.333333 12.8 34.133333v264.533333c0 17.066667-12.8 29.866667-29.866667 29.866667h-260.266667c-12.8 0-25.6-8.533333-29.866666-17.066667s0-25.6 8.533333-34.133333l89.6-93.866667z" p-id="11738" fill="#ffffff"></path></svg>';
    resetBtn.appendChild(resetIcon);
    controlsDiv.appendChild(resetBtn);

    // 创建文件输入元素
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'bgFileInput';
    fileInput.accept = 'image/*';
    controlsDiv.appendChild(fileInput);

    // 将按钮容器添加到页面
    document.body.appendChild(controlsDiv);

    // [其余函数保持不变...]
    // 替换背景图片函数
    function replaceBackground(imageFile) {
        if (!imageFile) return;

        if (imageFile.size > 4 * 1024 * 1024) {
            alert('图片大小不能超过4MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;

            const imgCont = document.querySelector('.img_cont');
            const hpTopCover = document.querySelector('.hp_top_cover');

            if (imgCont) {
                imgCont.style.backgroundImage = `url("${imageData}")`;
                imgCont.style.backgroundSize = 'cover';
                imgCont.style.backgroundPosition = 'center';
                imgCont.style.backgroundRepeat = 'no-repeat';
            }

            if (hpTopCover) {
                hpTopCover.style.backgroundImage = `url("${imageData}")`;
                hpTopCover.style.backgroundSize = 'cover';
                hpTopCover.style.backgroundPosition = 'center';
                hpTopCover.style.backgroundRepeat = 'no-repeat';
            }

            localStorage.setItem('customBingBg', imageData);
        };
        reader.readAsDataURL(imageFile);
    }

    // 重置背景函数
    function resetBackground() {
        if (!confirm('确定要恢复默认背景吗？')) {
            return;
        }

        const imgCont = document.querySelector('.img_cont');
        const hpTopCover = document.querySelector('.hp_top_cover');

        if (imgCont) imgCont.style.backgroundImage = '';
        if (hpTopCover) hpTopCover.style.backgroundImage = '';

        localStorage.removeItem('customBingBg');

        document.cookie = 'SRCHD=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.bing.com';
        document.cookie = 'SRCHUID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.bing.com';
        document.cookie = 'SRCHUSR=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.bing.com';

        location.reload();
    }

    // 检查是否有保存的自定义背景
    function checkSavedBackground() {
        const savedBg = localStorage.getItem('customBingBg');
        if (savedBg) {
            const imgCont = document.querySelector('.img_cont');
            const hpTopCover = document.querySelector('.hp_top_cover');

            if (imgCont) {
                imgCont.style.backgroundImage = `url("${savedBg}")`;
                imgCont.style.backgroundSize = 'cover';
                imgCont.style.backgroundPosition = 'center';
                imgCont.style.backgroundRepeat = 'no-repeat';
            }

            if (hpTopCover) {
                hpTopCover.style.backgroundImage = `url("${savedBg}")`;
                hpTopCover.style.backgroundSize = 'cover';
                hpTopCover.style.backgroundPosition = 'center';
                hpTopCover.style.backgroundRepeat = 'no-repeat';
            }
        }
    }

    // 移除不需要的元素
    function removeUnwantedElements() {
        const musCard = document.querySelector('.musCard');
        const hpTriviaOuter = document.querySelector('.hp_trivia_outer');

        if (musCard) musCard.remove();
        if (hpTriviaOuter) hpTriviaOuter.remove();
    }

    // 事件监听器
    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            replaceBackground(this.files[0]);
        }
        this.value = '';
    });

    resetBtn.addEventListener('click', resetBackground);

    // 页面加载时检查
    window.addEventListener('load', function() {
        setTimeout(() => {
            checkSavedBackground();
            removeUnwantedElements();
        }, 1000);
    });

    // 永久监听并移除不需要的元素
    const observer = new MutationObserver(function(mutations) {
        removeUnwantedElements();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 添加自定义CSS样式
    GM_addStyle(`
        .bg-controls {
            position: fixed;
            left: 0;
            bottom: 10px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 5px;
            padding-left: 5px;
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
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }

        #ms-custom-bg-btn:hover {
            width: 120px;
            background: rgba(0, 120, 212, 0.7);
            padding-left: 10px;
        }

        #ms-custom-bg-btn::before {
            content: '上传背景';
            position: absolute;
            left: 40px;
            top: 48%;
            transform: translateY(-50%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        #ms-custom-bg-btn:hover::before {
            opacity: 1;
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
            width: 40px;
            height: 40px;
            overflow: hidden;
            white-space: nowrap;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }

        #ms-reset-bg-btn:hover {
            width: 120px;
            background: rgba(40, 40, 40, 0.7);
            padding-left: 10px;
        }

        #ms-reset-bg-btn::before {
            content: '恢复默认';
            position: absolute;
            left: 40px;
            top: 48%;
            transform: translateY(-50%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        #ms-reset-bg-btn:hover::before {
            opacity: 1;
        }

        #ms-btn-icon {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-right: 0;
            flex-shrink: 0;
        }

        #bgFileInput {
            display: none;
        }

        #scroll_cont {
            margin-top: 47px !important;
        }
    `);
})();