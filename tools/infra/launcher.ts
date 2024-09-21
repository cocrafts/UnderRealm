import { constructDomainName, zoneId } from './shared';

export const constructLauncher = () => {
	const domainName = constructDomainName('launcher', $app.stage);

	const launcher = new sst.aws.StaticSite('launcher', {
		path: 'launcher',
		build: {
			command: 'yarn build',
			output: 'metacraft',
		},
		domain: {
			name: domainName,
			redirects:
				$app.stage === 'production' ? [`www.${domainName}`] : undefined,
			dns: sst.aws.dns({ zone: zoneId }),
		},
	});

	return launcher;
};
