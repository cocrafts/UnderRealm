import { mongo } from 'models';
import type { IGameDuel } from 'models/game';
import { GameDuel } from 'models/game';
import type { IUser } from 'models/user';
import { User } from 'models/user';
import { createGoogleSheetTab, writeToGoogleSheet } from 'utils/google';
import { logger } from 'utils/logger';

const getNewRegisterUser = async (startDate: Date): Promise<IUser[]> => {
	return await User.find({ createdAt: { $gte: startDate } });
};

const getSystemGameDuels = async (startDate: Date) => {
	return await GameDuel.find({ createdAt: { $gte: startDate } });
};

// for each user, calc the total duels, wins, losses, timestamp of each match
const getUserGameStats = async (user: IUser, duels: IGameDuel[]) => {
	let wins = 0;
	let loses = 0;
	const userDuels: IGameDuel[] = [];
	duels.forEach((curr) => {
		if (
			curr.config.firstPlayer.id != user.id &&
			curr.config.firstPlayer.id != user.id
		) {
			return;
		}
		userDuels.push(curr);
		if (curr.winner && curr.winner == user.id) {
			wins++;
		} else {
			loses++;
		}
	});

	const isoDates = userDuels.map((curr) => curr.createdAt.toISOString());
	return [
		user.id,
		wins + loses,
		wins,
		loses,
		isoDates.length ? isoDates.join('\n') : 'NULL',
	];
};

// calc total duels, DAU for each day
const getDAUStats = (duels: IGameDuel[]) => {
	const dauStats: Record<string, Record<string, Boolean>> = {};
	duels.forEach((duel) => {
		const dateString = duel.createdAt.toISOString().split('T')[0]; // only get date
		if (!dauStats[dateString]) {
			dauStats[dateString] = {};
		}
		dauStats[dateString][duel.config.firstPlayer.id] = true;
		dauStats[dateString][duel.config.secondPlayer.id] = true;
	});
	return Object.fromEntries(
		Object.entries(dauStats).map(([date, userIds]) => [
			date,
			Object.keys(userIds).length,
		]),
	);
};

const getSystemStatsAggregator = async (
	newUsers: IUser[],
	duels: IGameDuel[],
	systemDAUStats: Record<string, number>,
) => {
	const totalDuels = duels.length;
	let newEmailUser = 0;
	let newWalletUser = 0;
	newUsers.forEach((newUser) => {
		if (newUser.email) {
			newEmailUser++;
		} else {
			newWalletUser++;
		}
	});

	const verticalList = [
		[newEmailUser + newWalletUser],
		[newEmailUser],
		[newWalletUser],
		[totalDuels],
		Object.keys(systemDAUStats),
		Object.values(systemDAUStats),
	];
	const maxHeight = Math.max(...verticalList.map((ele) => ele.length));
	const horizontalList = Array.from({ length: maxHeight }, (_, index) => [
		...verticalList.map((ele) => ele[index] || ''),
	]);

	return horizontalList;
};

export const handler = async (event) => {
	logger.info('Cron job running...', event);

	const beginDate = new Date(2024, 9, 1);
	const newSheetName = new Date().toISOString().split('T')[0];
	const spreadsheetId = process.env.GCP_SHEET_SPREADSHEET_ID;
	if (!spreadsheetId) {
		logger.error('failed to get spreadsheet id from environment');
	}

	const users = await getNewRegisterUser(beginDate);
	const newUsersInfo = users.map((val) => {
		const userType = val.email != undefined ? 'email' : 'wallet';
		const address = val.email ? val.email : val.address;
		return [userType, address, val.createdAt];
	});

	const newUserTabName = 'NEW_USER_' + newSheetName;
	const userStatsTabName = 'USER_STATS_' + newSheetName;
	const systemStatsTabName = 'SYSTEM_STATS_' + newSheetName;

	await Promise.all([
		createGoogleSheetTab(spreadsheetId, newUserTabName),
		createGoogleSheetTab(spreadsheetId, userStatsTabName),
		createGoogleSheetTab(spreadsheetId, systemStatsTabName),
	]);

	const duels: IGameDuel[] = await getSystemGameDuels(beginDate);

	const usersStat = await Promise.all(
		users.map(async (user) => {
			return await getUserGameStats(user, duels);
		}),
	);

	const systemDAUStats = getDAUStats(duels);
	const aggregatedStats = await getSystemStatsAggregator(
		users,
		duels,
		systemDAUStats,
	);

	// Step 4: Write data to Google Sheets
	await Promise.all([
		writeToGoogleSheet(spreadsheetId, newUserTabName, 'A1', [
			['type', 'address', 'created At'],
			...newUsersInfo,
		]),
		writeToGoogleSheet(spreadsheetId, userStatsTabName, 'A1', [
			['userId', 'total', 'wins', 'loss', 'timestamps'],
			...usersStat,
		]),
		writeToGoogleSheet(spreadsheetId, systemStatsTabName, 'A1', [
			[
				'new users',
				'via email',
				'via wallet',
				'new duels played',
				'Date',
				'DAU',
			],
			...aggregatedStats,
		]),
	]);

	logger.info('Data successfully written to Google Sheets!');

	return {
		statusCode: 200,
		body: JSON.stringify({ message: 'Cron job executed successfully!' }),
	};
};

await mongo.connect();
