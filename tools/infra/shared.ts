import * as dotenv from 'dotenv';

export const baseDomainName = 'underrealm.io';
export const hostedZone = 'underrealm.io';
export const zoneId = 'Z0837301F5UFZQG04XEQ';

const stageAlias: Record<string, string> = {
	production: ' ',
	staging: 'staging',
	development: 'dev',
};

const siteAlias = {
	launcher: ' ',
	api: 'api',
	websocket: 'ws',
};

export const constructDomainName = (
	site: keyof typeof siteAlias,
	stage: string,
) => {
	const stagePrefix = (stageAlias[stage] || `${stage}`).trim();
	const sitePrefix = (siteAlias[site] || site).trim();
	const domainName = [stagePrefix, sitePrefix, baseDomainName]
		.filter(Boolean)
		.join('.');

	console.log('Domain', domainName);

	return domainName;
};

export const loadEnvsFromStage = (stage: string): void => {
	dotenv.config({ path: `.env.${stage}` });
};
