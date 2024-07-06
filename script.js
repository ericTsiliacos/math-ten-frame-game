document.addEventListener('DOMContentLoaded', () => {
    const box1 = document.getElementById('box1');
    const box2 = document.getElementById('box2');

    const randomNumber1 = Math.floor(Math.random() * 13);
    const randomNumber2 = Math.floor(Math.random() * 13);

    box1.setAttribute('data-number', randomNumber1);
    box2.setAttribute('data-number', randomNumber2);

    box1.innerHTML = randomNumber1;
    box2.innerHTML = randomNumber2;

    const boxes = document.querySelectorAll('.number-box');

    boxes.forEach(box => {
        box.addEventListener('click', () => {
            toggleTenFrames();
        });
    });

    function toggleTenFrames() {
        boxes.forEach(box => {
            if (box.querySelector('.ten-frame-container')) {
                updateNumberBox(box);
            } else {
                const number = parseInt(box.getAttribute('data-number'));
                const tenFrameContainer = createTenFrames(number);
                box.innerHTML = '';
                box.appendChild(tenFrameContainer);
                tenFrameContainer.style.display = 'flex';
            }
        });
    }

    function createTenFrames(number) {
        const tenFrameContainer = document.createElement('div');
        tenFrameContainer.classList.add('ten-frame-container');

        const fullFrames = Math.floor(number / 10);
        const remainingDots = number % 10;

        for (let i = 0; i < fullFrames; i++) {
            const tenFrame = createTenFrame(10);
            tenFrameContainer.appendChild(tenFrame);
        }

        if (remainingDots > 0 || number === 0) {
            const tenFrame = createTenFrame(remainingDots);
            tenFrameContainer.appendChild(tenFrame);
        }

        return tenFrameContainer;
    }

    function createTenFrame(dots) {
        const tenFrame = document.createElement('div');
        tenFrame.classList.add('ten-frame');

        for (let i = 0; i < 10; i++) {
            const dotContainer = document.createElement('div');
            dotContainer.classList.add('dot');
            if (i < dots) {
                const filledDot = document.createElement('div');
                filledDot.classList.add('filled-dot');
                filledDot.setAttribute('draggable', true);
                filledDot.addEventListener('dragstart', handleDragStart);
                filledDot.addEventListener('touchstart', handleTouchStart, { passive: false });
                dotContainer.appendChild(filledDot);
            }
            dotContainer.addEventListener('dragover', handleDragOver);
            dotContainer.addEventListener('drop', handleDrop);
            dotContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
            dotContainer.addEventListener('touchend', handleTouchEnd);
            tenFrame.appendChild(dotContainer);
        }

        return tenFrame;
    }

    function handleDragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.className);
        event.target.classList.add('dragging');
        event.target.closest('.ten-frame').classList.add('dragging-from');
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        const draggingDot = document.querySelector('.dragging');
        const sourceTenFrame = document.querySelector('.dragging-from');
        if (draggingDot) {
            if (event.target.classList.contains('dot') && !event.target.querySelector('.filled-dot')) {
                event.target.appendChild(draggingDot);
                draggingDot.classList.remove('dragging');
                sourceTenFrame.classList.remove('dragging-from');

                checkTenFrameComplete(sourceTenFrame, event.target.closest('.ten-frame'));
            }
        }
    }

    function handleTouchStart(event) {
        event.preventDefault();
        const touch = event.touches[0];
        const dot = event.target;
        dot.classList.add('dragging');
        dot.closest('.ten-frame').classList.add('dragging-from');
        dot.style.position = 'absolute';
        dot.style.zIndex = 1000;
        moveAt(touch.pageX, touch.pageY, dot);
        document.body.append(dot);

        function moveAt(pageX, pageY, element) {
            element.style.left = pageX - element.offsetWidth / 2 + 'px';
            element.style.top = pageY - element.offsetHeight / 2 + 'px';
        }

        function onTouchMove(event) {
            event.preventDefault();
            const touch = event.touches[0];
            moveAt(touch.pageX, touch.pageY, dot);
        }

        document.addEventListener('touchmove', onTouchMove, { passive: false });

        dot.ontouchend = function (event) {
            document.removeEventListener('touchmove', onTouchMove);
            dot.classList.remove('dragging');
            dot.style.position = 'relative';
            dot.style.zIndex = 0;
            dot.style.left = 0;
            dot.style.top = 0;

            const touch = event.changedTouches[0];
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            const sourceTenFrame = document.querySelector('.dragging-from');
            if (target && target.classList.contains('dot') && !target.querySelector('.filled-dot')) {
                target.appendChild(dot);
                sourceTenFrame.classList.remove('dragging-from');
                checkTenFrameComplete(sourceTenFrame, target.closest('.ten-frame'));
            } else {
                sourceTenFrame.appendChild(dot);
                sourceTenFrame.classList.remove('dragging-from');
            }
        };
    }

    function handleTouchMove(event) {
        event.preventDefault();
    }

    function handleTouchEnd(event) {
        event.preventDefault();
    }

    function checkTenFrameComplete(sourceTenFrame, targetTenFrame) {
        const sourceFilledDots = sourceTenFrame.querySelectorAll('.filled-dot').length;
        const targetFilledDots = targetTenFrame.querySelectorAll('.filled-dot').length;

        if (sourceFilledDots === 0 || sourceFilledDots === 5 || targetFilledDots === 5 || targetFilledDots === 10) {
            boxes.forEach(box => {
                updateNumberBox(box);
            });
        }
    }

    function updateNumberBox(box) {
        let totalDots = 0;
        const tenFrames = box.querySelectorAll('.ten-frame');
        tenFrames.forEach(frame => {
            totalDots += frame.querySelectorAll('.filled-dot').length;
        });

        box.innerHTML = totalDots;
        box.setAttribute('data-number', totalDots);
    }
});
