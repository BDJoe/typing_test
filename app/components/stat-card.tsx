import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp, library } from "@fortawesome/fontawesome-svg-core";

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fas, far, fab);

interface Props {
	icon: string;
	value: string | number;
	label: string;
}

const StatCard = ({ icon, value, label }: Props) => {
	return (
		<div className='bg-card border-2 rounded-3xl p-6 text-center transition-all duration-200 ease-in-out'>
			<FontAwesomeIcon
				icon={icon as IconProp}
				className='mb-3 block text-2xl'
			/>
			<div className='text-4xl font-bold font-sans mb-1 leading-none' id='wpm'>
				{value}
			</div>
			<div className='text-sm uppercase tracking-wider font-medium'>
				{label}
			</div>
		</div>
	);
};

export default StatCard;
