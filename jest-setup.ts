import jsdom from 'jsdom';
const { JSDOM } = jsdom;
import 'jest-extended';
import 'jest-extended/all';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface Global {
            document: Document;
            window: Window;
            navigator: Navigator;
        }
    }
}

beforeEach(() => {
    const { window } = new JSDOM(``, {
        includeNodeLocations: true,
        storageQuota: 10000000,
    });

    expect.hasAssertions();
    global.document = window.document;
    if (global.document.defaultView) {
        global.window = global.document.defaultView;
    }
});
