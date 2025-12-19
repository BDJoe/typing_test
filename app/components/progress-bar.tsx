import React from "react";

const ProgressBar = () => {
	return (
		<div className='h-1 bg-[#222222] rounded-xs overflow-hidden mb-2'>
			<div
				className='h-full bg-white rounded-xs transition-[width] duration-300 ease-in-out w-0'
				id='progressFill'
			></div>
		</div>
	);
};

export default ProgressBar;
