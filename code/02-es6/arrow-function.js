element.addEventListener('click', function () {
    // this === element
});

element.addEventListener('click', () => {
    // this === current lexical context, e.g. class instance
});
