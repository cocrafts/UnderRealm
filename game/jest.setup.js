global.jest = require('jest-mock');

jest.mock('chalk', () => ({
	red: jest.fn((text) => text),
	green: jest.fn((text) => text),
	blue: jest.fn((text) => text),
	yellow: jest.fn((text) => text),
}));

jest.setTimeout(100000);
