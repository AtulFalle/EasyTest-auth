import { Selector } from 'testcafe';

fixture('Test Recording')
    .page('http://localhost:5173');

test('Record User Interactions', async t => {
    // Enable both video recording and dev tools capture
    await t.setTestSpeed(0.7) // Slow down for better recording
        .maximizeWindow()
        .openDevTools();
        
    // Your test actions will be recorded here
    // Example interaction:
    await t
        .click('#some-button')
        .typeText('#input-field', 'Test Input')
        .pressKey('enter');
});