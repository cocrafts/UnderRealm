import mongoose from 'mongoose';
import { logger } from 'utils/logger';

mongoose.connection.on('connected', () => {
	logger.info('MongoDB connected');
});

mongoose.connection.on('disconnected', () =>
	logger.warn('MongoDB disconnected'),
);

mongoose.connection.on('reconnected', () => {
	logger.info('MongoDB reconnected');
});

mongoose.connection.on('disconnecting', () => {
	logger.warn('MongoDB disconnecting');
});

mongoose.connection.on('close', () => {
	logger.warn('MongoDB close');
});
