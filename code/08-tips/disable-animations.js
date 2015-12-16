// should be registered as run block
function disableNgAnimate($animate) {
    $animate.enabled(false);
}

export default [
    '$animate',
    disableNgAnimate
];
