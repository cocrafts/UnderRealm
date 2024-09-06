import type { FC } from 'react';
import type { ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface Props {
	style?: ViewStyle;
	size?: number;
	color?: string;
}

const BurgerIcon: FC<Props> = ({ style, size = 32, color = '#cdc8b5' }) => {
	const height = size;
	return (
		<Svg
			style={style}
			width={size}
			height={height}
			fill="none"
			viewBox="0 0 32 32"
		>
			<Path
				fill={color}
				d="M4 10H28C29.104 10 30 9.104 30 8C30 6.896 29.104 6 28 6H4C2.896 6 2 6.896 2 8C2 9.104 2.896 10 4 10ZM28 14H4C2.896 14 2 14.896 2 16C2 17.104 2.896 18 4 18H28C29.104 18 30 17.104 30 16C30 14.896 29.104 14 28 14ZM28 22H4C2.896 22 2 22.896 2 24C2 25.104 2.896 26 4 26H28C29.104 26 30 25.104 30 24C30 22.896 29.104 22 28 22Z"
			/>
		</Svg>
	);
};

export default BurgerIcon;
