let SYNC = true;

function isWorkNeeded(units) {
    return units < 10000;
}

function doUnitOfWork() {
    for (var i = 0; i <= 500000; i++) {} // some predictable work
}

// synchronous
function doWorkSync() {
    let units = 0;
    while (isWorkNeeded(units)) {
        doUnitOfWork();
        units++
    }
}

// deferred
function doWorkDeferred(onDone) {
    const TIME_FOR_UNIT_OF_WORK = 2; // 2ms
    let units = 0;
    function callback(deadline) {
        while (isWorkNeeded(units) && deadline.timeRemaining() > TIME_FOR_UNIT_OF_WORK) {
            doUnitOfWork();
            units++;
        }

        if (isWorkNeeded(units)) {
            requestIdleCallback(callback);
        } else {
            onDone();
        }
    }
    requestIdleCallback(callback);
}

function handleClick() {
    if (SYNC) {
        console.time('sync work');
        doWorkSync();
        console.timeEnd('sync work');
    } else {
        console.time('deferred work');
        doWorkDeferred(() => console.timeEnd('deferred work'));
    }
}

// TODO: Define `App` namespace.
function init() {
    const tableBtn = document.querySelector('#table');
    const sphereBtn = document.querySelector('#sphere');
    const helixBtn = document.querySelector('#helix');
    const gridBtn = document.querySelector('#grid');
    const toggleCheckbox = document.querySelector('#toggle');

    // TODO: Tidy these up in to namespace (they're defined by animation.js)
    initAnimation();
    animate();

    toggleCheckbox.addEventListener('change', e => {
        SYNC = !!e.target.checked;
    });

    tableBtn.addEventListener('click', handleClick);
    sphereBtn.addEventListener('click', handleClick);
    helixBtn.addEventListener('click', handleClick);
    gridBtn.addEventListener('click', handleClick);
}
