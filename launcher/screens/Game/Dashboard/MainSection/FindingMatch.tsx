import { StyleSheet } from 'react-native';
import { Text } from '@metacraft/ui';
import Loading from 'components/Loading';
import { useFindMatchSubscription } from 'utils/graphql';
import { useProfile } from 'utils/hooks';

export const FindingMatch = () => {
	const { profile } = useProfile();
	const { data, loading } = useFindMatchSubscription({
		variables: { userId: profile.id },
	});

	if (data) console.log('Match found', data);

	if (loading) return <Loading />;
	return <Text style={styles.title}>Match found</Text>;
};

export default FindingMatch;

const styles = StyleSheet.create({
	title: {
		textAlign: 'center',
		fontSize: 18,
	},
});
