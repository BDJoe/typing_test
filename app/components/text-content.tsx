interface Props {
	textContent: string[][];
	inputRef: React.RefObject<HTMLTextAreaElement | null>;
	textContentRef: React.RefObject<HTMLDivElement | null>;
	cursorRef: React.RefObject<HTMLSpanElement | null>;
	handleInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextContent = ({
	textContent,
	inputRef,
	textContentRef,
	cursorRef,
	handleInput,
}: Props) => {
	return (
		<div className='max-md:p-6 max-md:text-base bg-[#1a1a1a] border-[#333333] border-2 rounded-xl p-8 mb-8 text-2xl leading-[1.8] relative min-h-30 flex items-center'>
			<span
				className='absolute top-8 bg-[#1a1a1a] left-6 h-[1.2em] animate-pulse transition-all duration-100 ease-in-out'
				ref={cursorRef}
			>
				|
			</span>
			<div className='w-full' ref={textContentRef}>
				{textContent.map((char, index) => (
					<span key={index} className={char[1]}>
						{char[0]}
					</span>
				))}
			</div>
			<textarea
				className='fixed w-1 h-1 left-0 top-0 opacity-0 pointer-events-none'
				ref={inputRef}
				autoFocus
				autoComplete='off'
				spellCheck='false'
				onChange={handleInput}
				onKeyDown={(e) => {
					if (e.ctrlKey && e.key === "z") {
						e.preventDefault();
						console.log("Undo is disabled");
					}
				}}
				onCopy={(e) => {
					e.preventDefault();
					return false;
				}}
				onPaste={(e) => {
					e.preventDefault();
					return false;
				}}
			/>
		</div>
	);
};

export default TextContent;
