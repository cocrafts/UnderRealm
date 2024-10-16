import { model } from 'mongoose';

import { createSchema } from './utils';

export type ICrawlSnapshot = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
};

const CrawlSnapshotSchema = createSchema({});

export const getLastCrawlDate = async (): Promise<Date> => {
	const snapshot = await CrawlSnapshot.findOne({});
	if (!snapshot) {
		// FIXME: remove this hardcoded value
		const startDate = new Date(2024, 9, 14);
		const newSnapshot = await CrawlSnapshot.create({
			createdAt: startDate,
			updatedAt: startDate,
		});
		return newSnapshot.updatedAt;
	}
	return snapshot.updatedAt;
};

export const updateCrawlDate = async () => {
	const result = await CrawlSnapshot.findOneAndUpdate({}, {});
	if (!result) {
		// FIXME: remove this hardcoded value
		const startDate = new Date(2024, 9, 14);
		await CrawlSnapshot.create({
			createdAt: startDate,
			updatedAt: startDate,
		});
	}
};

export const CrawlSnapshot = model<ICrawlSnapshot>(
	'CrawlSnapshot',
	CrawlSnapshotSchema,
);
