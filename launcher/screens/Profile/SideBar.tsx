import type { FC } from 'react';
import { Image, ImageBackground, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '@metacraft/ui';
import Avatar from 'components/Avatar';
import { useProfile } from 'utils/hooks';
import resources from 'utils/resources';

import type { MenuProps } from './internal';
import { Tabs } from './internal';
import TabSelection from './TabSelection';

type Props = MenuProps & {
	onSignOut: () => void;
};

const SideBar: FC<Props> = ({ tab, onSelectTab, onSignOut }) => {
	const { styles } = useStyles(stylesheet);
	const { profile } = useProfile();

	return (
		<ImageBackground
			style={styles.container}
			source={resources.profile.tabBar}
			resizeMode="stretch"
		>
			<View style={styles.basicInfoContainer}>
				<Avatar imageUri={profile?.avatarUrl} size={64} />

				<View style={styles.nameContainer}>
					<Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
						{profile?.name || ''}
					</Text>
					<Text style={styles.email} numberOfLines={1} ellipsizeMode="tail">
						{profile?.email}
					</Text>
				</View>
			</View>

			<Image
				style={styles.separateLine}
				source={resources.profile.separateLine}
			/>

			<View style={styles.tabContainer}>
				<TabSelection
					title={Tabs.INFORMATION}
					isActive={tab === Tabs.INFORMATION}
					onPress={() => onSelectTab(Tabs.INFORMATION)}
				/>
				{__DEV__ && (
					<TabSelection
						title={Tabs.ACCOUNT_LINKING}
						isActive={tab === Tabs.ACCOUNT_LINKING}
						onPress={() => onSelectTab(Tabs.ACCOUNT_LINKING)}
					/>
				)}
				{__DEV__ && (
					<TabSelection
						title={Tabs.INVENTORY}
						isActive={tab === Tabs.INVENTORY}
						onPress={() => onSelectTab(Tabs.INVENTORY)}
					/>
				)}
			</View>
			<Image
				style={styles.separateLine}
				source={resources.profile.separateLine}
			/>

			<TouchableOpacity onPress={onSignOut}>
				<Text>Log Out</Text>
			</TouchableOpacity>
		</ImageBackground>
	);
};

export default SideBar;

const stylesheet = createStyleSheet((_, { screen }) => ({
	container: {
		width: { lg: 280 },
		minHeight: screen.height - 68,
		paddingLeft: 24,
		paddingTop: 40,
		paddingRight: 28,
		gap: 24,
	},
	avatarContainer: {
		width: 64,
		height: 64,
		padding: 2,
	},
	avatar: {
		width: 60,
		height: 60,
	},
	basicInfoContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		overflow: 'hidden',
	},
	nameContainer: {
		flex: 1,
	},
	name: {
		color: '#ffffff',
		fontSize: 16,
	},
	email: {
		color: '#F2E0C3',
		fontSize: 12,
	},
	separateLine: {
		width: 216,
		height: 2,
	},
	tabContainer: {
		gap: 12,
	},
}));
