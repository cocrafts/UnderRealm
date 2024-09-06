import type { FC } from 'react';
import type { ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

interface Props {
	style?: ViewStyle;
	color?: string;
	size?: number;
}

export const BottomTitleSeparator: FC<Props> = ({
	style,
	color = '#CDC8B5',
	size = 286,
}) => {
	const height = (size * 9) / 286;

	return (
		<Svg
			style={style}
			width={size}
			height={height}
			viewBox="0 0 286 9"
			fill="none"
		>
			<Path
				d="M115.5 1C120.268 1.43625 121.831 6.08875 121.847 6.14C121.863 6.205 122.4 6.24625 121.982 6.23125C122.042 6.21625 122.08 6.15125 122.068 6.085C121.495 2.78876 128.255 1.45001 129.343 0.65626H129.634C130.531 1.02501 132.032 1.72001 133.011 2.73376C133.223 2.89251 133.223 2.89251 133.264 2.89251C133.327 2.89251 133.378 2.83751 133.378 2.76751C133.378 1.85626 136.159 1.82501 137.416 0.65626H139.36C138.626 1.93126 137.944 1.57126 137.908 1.71001C139.112 2.73876 138.775 4.76 138.823 4.76C139.055 4.56001 139.548 4.44751 140.029 4.38501C142.18 6.3375 141.927 9 141.927 9C142.895 7.2525 143.899 8.225 144.296 7.2825V7.31375C144.296 7.31375 144.329 7.305 144.385 7.295C144.441 7.305 144.474 7.31375 144.474 7.31375V7.2825C144.871 8.225 145.875 7.2525 147.34 9C147.34 9 146.589 6.2375 148.754 4.37501C149.258 4.43751 149.787 4.55126 150.031 4.76C150.46 4.76 149.744 2.73876 150.947 1.71001C150.911 1.57126 150.228 1.93126 149.495 0.65626H152.02C152.467 1.82501 155.248 1.85626 155.248 2.76751C155.248 2.83751 155.298 2.89251 155.361 2.89251C155.404 2.89251 155.404 2.89251 155.616 2.73376C156.965 1.72001 158.095 1.02501 158.993 0.65626H159.121C160.208 1.45001 166.12 2.70375 166.5 6C166.5 6 166.443 6.12751 166.5 6.14501C166.559 6.16126 166.63 6.13851 166.648 6.07601C166.664 6.01976 168.235 1.43875 173 1H286V0H2.11596e-06L0 1H115.5ZM133.183 2.56001C133.169 2.55001 133.154 2.53876 133.139 2.52626C132.021 1.68626 131.048 1.06251 130.227 0.65626H130.901C132.103 1.25251 132.934 1.93126 132.934 1.93126C133.648 1.22876 135.119 0.83751 135.638 0.65626H136.482C135.273 1.02126 133.447 1.70501 133.183 2.56001ZM155.79 2.52626C155.639 2.53751 155.671 2.55001 155.443 2.56001C155.18 1.70501 153.949 1.02126 152.145 0.65626H152.924C153.667 0.83751 154.913 1.22876 155.627 1.93126C155.627 1.93126 156.459 1.25251 158.022 0.65626H158.4C157.579 1.06251 157.22 1.68626 155.79 2.52626ZM166.816 4.45501C166.93 4.41751 167.294 1.7525 172 1C168.376 1.9 167.216 4.26501 166.648 5.47625C166.429 2.85376 162.111 1.26501 160.064 0.65626H161.209C163.885 1.42626 166.949 2.69501 166.816 4.45501ZM128.651 0.65626C126.353 1.26501 122.034 2.85376 121.815 5.47625C121.246 4.26251 119.505 1.89375 116.5 1C121.202 1.19625 121.631 4.41751 121.746 4.45501C121.612 2.69501 124.675 1.42626 127.947 0.65626H128.651Z"
				fill={'url(#linearGradientBottom)'}
			/>
			<Defs>
				<LinearGradient
					id="linearGradientBottom"
					x1={0}
					y1={9}
					x2={286}
					y2={9}
					gradientUnits="userSpaceOnUse"
				>
					<Stop stopColor={color} stopOpacity={0} offset={0.1} />
					<Stop stopColor={color} stopOpacity={1} offset={0.5} />
					<Stop stopColor={color} stopOpacity={0} offset={0.9} />
				</LinearGradient>
			</Defs>
		</Svg>
	);
};

export default BottomTitleSeparator;
