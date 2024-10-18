import Darkmode from '../darkmode';
describe('Darkmode', function () {
    var darkmode;
    beforeEach(function () {
        document.body.innerHTML = '';
        darkmode = new Darkmode();
    });
    test('should create an instance of Darkmode', function () {
        expect(darkmode).toBeInstanceOf(Darkmode);
    });
    test('should have a toggle method', function () {
        expect(typeof darkmode.toggle).toBe('function');
    });
    test('should toggle darkmode class on body', function () {
        darkmode.toggle();
        expect(document.body.classList.contains('darkmode-active')).toBe(true);
        darkmode.toggle();
        expect(document.body.classList.contains('darkmode-active')).toBe(false);
    });
    // Add more tests based on the actual methods and properties of your Darkmode class
});
